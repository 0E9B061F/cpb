<script>
  import FB from '../FB.svelte'
  export let w = 100
  export let center = false
  $: wc = w ? `w${w}` : ''
</script>

<FB vert {center} c="flexdoc {wc}">
  <slot></slot>
</FB>
