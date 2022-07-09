<script>
  import Link from './link/Link.svelte'
  import FB from './FB.svelte'
  import { getContext } from 'svelte'
  const rc = getContext('rc')
</script>

<Link silent precise>
  <FB title c="logo">{$rc.title}</FB>
</Link>
