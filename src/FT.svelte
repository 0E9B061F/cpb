<script>
  import FB from './FB.svelte'
  export let c = []
  if (typeof(c) == 'string') c = c.split(' ')
  c.push('fp-table')
</script>

<FB {c}>
  <slot></slot>
</FB>
