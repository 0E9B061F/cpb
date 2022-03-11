<script>
	import FB from './FB.svelte'
	import Link from './Link.svelte'
	import R2Over from './r2/R2Over.svelte'
  import { getContext } from 'svelte'
  const loading = getContext('loading')
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
	$: showany = !!$haspage || showedit || showhead || !!$editing || !!$hashistory
</script>

<R2Over hide show={$loading} expand={false} size={0.3}>
<FB vert>
	{#if !!$haspage && $loc.uuid == $page.val.uuid}
		<span class="perma-type">VERSION PERMA</span>
	{:else if !!$haspage && $loc.uuid == $page.val.pageUuid}
		<span class="perma-type">PAGE PERMA</span>
	{/if}
	<FB>
		{#if !$editing && $haspage}
			<Link self opt={{history:true}}>HISTORY</Link>
		{/if}
		{#if showedit}
		  <Link self opt={{edit:true}}>EDIT</Link>
		{/if}
		{#if showhead}
		  <Link space={$page.val.namespace} title={$page.val.title}>HEAD</Link>
		{/if}
		{#if $editing}
		  <Link self opt={{edit:undefined}}>CANCEL</Link>
		{/if}
		{#if $hashistory}
		  <Link self opt={{history:undefined}}>BACK</Link>
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
</FB>
</R2Over>
