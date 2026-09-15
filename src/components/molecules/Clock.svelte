<script lang="ts">
  let time = $state(new Date());

  $effect(() => {
    const interval = setInterval(() => {
      time = new Date();
    }, 1000);
    return () => clearInterval(interval);
  });

  function padZero(n: number): string {
    return n.toString().padStart(2, '0');
  }

  let display = $derived(
    `${padZero(time.getHours())}:${padZero(time.getMinutes())}:${padZero(time.getSeconds())}`
  );
</script>

<div class="flex items-center text-sm font-mono text-[var(--on-surface-variant)] tabular-nums">
  {display}
</div>