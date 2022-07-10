<script>
  import FB from '../FB.svelte'
  export let classes
  export let style
</script>

<FB center c={classes} {style}>
  <FB vert center>
    <slot></slot>
  </FB>
</FB>
