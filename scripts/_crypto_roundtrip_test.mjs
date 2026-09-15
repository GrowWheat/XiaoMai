// 临时诊断脚本：用与 src/utils/password-protection.ts 完全一致的算法做 加密->解密 往返。
// 用法：node scripts/_crypto_roundtrip_test.mjs   （Windows / Linux 均可）
// 目的：隔离变量。若本脚本在 Linux 上失败/抛错，说明 Node 的 Web Crypto 环境有问题；
//       若成功，则算法与 Node 都正常，问题必在“构建产物 / 部署 / 密码字节 / 浏览器缓存”。

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function base64UrlToBytes(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}
function aadFor(scope, version) {
  return encoder.encode(`xiaomai-protected-content:${version}:${scope}`);
}
async function deriveKey(password, salt, iterations) {
  const material = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt, iterations, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}
async function encrypt(content, password, scope) {
  if (typeof globalThis.crypto === "undefined" || !globalThis.crypto.subtle) {
    throw new Error("Web Crypto is unavailable (Node < 20 或未开启 global crypto)");
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, 310000);
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: aadFor(scope, 1) },
    key,
    encoder.encode(content),
  );
  return { salt: bytesToBase64Url(salt), iv: bytesToBase64Url(iv), ciphertext: bytesToBase64Url(new Uint8Array(ct)), scope };
}
async function decrypt(payload, password) {
  const key = await deriveKey(password, base64UrlToBytes(payload.salt), 310000);
  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64UrlToBytes(payload.iv), additionalData: aadFor(payload.scope, 1) },
    key,
    base64UrlToBytes(payload.ciphertext),
  );
  return decoder.decode(pt);
}

const scope = "post:加密示例";
const password = "xiaomai-secret";
const content = "<h1>受密码保护的文章</h1><p>这是解密后的正文。</p>";

console.log("Node:", process.version, "| globalThis.crypto.subtle:", typeof globalThis.crypto?.subtle);

const payload = await encrypt(content, password, scope);
console.log("加密载荷 scope =", payload.scope);
console.log("salt 长度(base64url) =", payload.salt.length, "iv 长度 =", payload.iv.length);
console.log("ciphertext 长度(base64url) =", payload.ciphertext.length);

const ok = await decrypt(payload, password);
console.log("✅ 正确密码解密成功：", ok === content ? "内容一致" : "内容不一致!");

try {
  await decrypt(payload, "wrong-password");
  console.log("❌ 错误密码居然解密成功（不应发生）");
} catch {
  console.log("✅ 错误密码被拒绝（与主题行为一致，前端会显示“密码错误”）");
}
