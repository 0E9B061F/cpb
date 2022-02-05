<script>
  import FB from '../FB.svelte'
  import Pipe from '../Pipe.svelte'
  export let txt
  export let w = 100
  export let between = false
</script>

<FB {between} c="flexlab w{w}">
  <FB vert center c="flexlab-txt">{txt}</FB>
  {#if between}<Pipe expand/>{/if}
  <slot></slot>
</FB>
