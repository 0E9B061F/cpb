<script>
  import Link from './Link.svelte'
  import { getContext } from 'svelte'
  const rc = getContext('rc')
</script>

<Link space="main" title="Home" silent>
  <div class="logo">{$rc.title}</div>
</Link>
