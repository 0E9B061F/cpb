<script>
  import Link from './link/Link.svelte'
  import FB from './FB.svelte'
  import { getContext } from 'svelte'
  const rc = getContext('rc')
</script>

<Link precise>
  <span class="logo">{$rc.title}</span>
</Link>
