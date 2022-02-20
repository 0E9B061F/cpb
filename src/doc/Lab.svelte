<script>
  import FB from '../FB.svelte'
  import Pipe from '../Pipe.svelte'
  export let txt
  export let w = null
  export let between = false
  export let flip = false
  $: wc = w ? `w${w}` : ''
</script>

<FB {between} {flip} c="flexlab {wc}">
  <FB vert center c="flexlab-txt">{txt}</FB>
  {#if between}<Pipe expand/>{/if}
  <slot></slot>
</FB>
