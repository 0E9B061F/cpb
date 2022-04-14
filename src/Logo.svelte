<script>
  import Link from './Link.svelte'
  import FB from './FB.svelte'
  import { getContext } from 'svelte'
  const rc = getContext('rc')
</script>

<Link space="main" title="Home" silent>
  <FB title c="logo">{$rc.title}</FB>
</Link>
