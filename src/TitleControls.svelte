<script>
	import FB from './FB.svelte'
	import Link from './Link.svelte'
  import {getContext} from 'svelte'
  const session = getContext('session')
	const hassess = getContext('hassess')
  const page = getContext('page')
  const haspage = getContext('haspage')
  const loc = getContext('loc')
</script>

<FB>
{#if $hassess && $haspage && !$page.val.historical}
  <Link self cmd="edit">EDIT</Link>
{/if}
<Link self cmd="history">HISTORY</Link>
{#if $haspage && !$page.val.historical}
  <Link uuid={$page.uuid}>HEAD</Link>
{/if}
{#if $loc.uuid && $haspage && !$page.val.historical}
  <Link space={$page.namespace} title={$page.title}>ANCHOR</Link>
{/if}
</FB>
