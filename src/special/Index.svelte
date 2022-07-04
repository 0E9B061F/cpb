<script>
  import Search from './Search.svelte'

  import { getContext } from 'svelte'

  const loc = getContext('loc')
</script>

<Search namespace={$loc.namespace}/>
