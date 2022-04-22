<script>
  export let args = []
  $: cls = (['classed', ...args]).join(' ')
</script>

<span class={cls}><slot></slot></span>
