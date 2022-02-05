<script>
  import FB from '../FB.svelte'
  export let txt
  export let w = 100
</script>

<FB c="flexlab w{w}">
  <FB vert center c="flexlab-txt">{txt}</FB>
  <slot></slot>
</FB>
