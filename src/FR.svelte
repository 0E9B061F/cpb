<script>
  import FB from './FB.svelte'
  import FP from './FP.svelte'
  export let lab = ''
  export let c = []
  if (typeof(c) == 'string') c = c.split(' ')
  c.push('fp-run')
  $: haslab = typeof(lab) == 'string' && lab.length
</script>

<FB {c}>
  {#if haslab}<FP c="fp-metalabel" {lab} />{/if}
  <slot></slot>
</FB>
