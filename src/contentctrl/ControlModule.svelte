<script>
  import FB from '../FB.svelte'
  export let name
</script>

<FB vert c="control-module cm-{name}">
  <slot></slot>
</FB>
