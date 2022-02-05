<script>
  import FB from '../FB.svelte'
  export let s = 'n'
  export let input = false
  export let flip = false
</script>

<FB {flip} c="flexline uitxt {s}txt {s}line {input ? 'input' : ''}">
  <slot></slot>
</FB>
