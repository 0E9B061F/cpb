<script>
	import FB from './FB.svelte'
	import Link from './Link.svelte'
  import { getContext } from 'svelte'
  const session = getContext('session')
	const hassess = getContext('hassess')
	const haslogin = getContext('haslogin')
	const hashistory = getContext('hashistory')
  const page = getContext('page')
  const haspage = getContext('haspage')
  const loc = getContext('loc')
  const editing = getContext('editing')
  const creating = getContext('creating')

	$: showedit = !!$haslogin && !!$haspage && !$page.val.historical && !$editing
	$: showhead = !!$haspage && $page.val.historical
	$: showany = !!$haspage || showedit || showhead || !!$editing
</script>

<FB>
	{#if $haspage}
		<Link self cmd="history">HISTORY</Link>
	{/if}
	{#if showedit}
	  <Link self cmd="edit">EDIT</Link>
	{/if}
	{#if showhead}
	  <Link space={$page.val.namespace} title={$page.val.title}>HEAD</Link>
	{/if}
	{#if $editing}
	  <Link decmd>CANCEL</Link>
	{/if}
	{#if showany}
		<span class="content-subtitle">&middot;</span>
	{/if}
	<span class="content-subtitle">
		{#if $creating}
			NEW
		{:else if $editing}
			EDIT
		{:else if $hashistory}
			HISTORY
		{:else if $haspage && $page.val.historical}
			OLD
		{:else if $haspage && !$page.val.historical}
			HEAD
		{/if}
	</span>
</FB>
