<script>
  import FB from '../FB.svelte'
  export let w = 100
</script>

<FB vert c="flexdoc w{w}">
  <slot></slot>
</FB>
