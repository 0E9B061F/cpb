<script>
	import FB from './FB.svelte'
	import Link from './Link.svelte'
	import R2Hider from './r2/R2Hider.svelte'
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
  const state = getContext('state')

	$: showany = $state.content || $state.editable || $state.historical || $state.editing  || $state.history
</script>

<R2Hider hide={$loading} size={0.3}>
<FB vert zero>
	{#if !!$haspage && $loc.uuid == $page.val.uuid}
		<FB end line="s2" dw={7} c="perma-type">VERSION PERMA</FB>
	{:else if !!$haspage && $loc.uuid == $page.val.pageUuid}
		<FB end line="s2" dw={7} c="perma-type">PAGE PERMA</FB>
	{/if}
	<FB line>
		{#if $state.content}
			<Link self opt={{history:true}}>HISTORY</Link>
		{/if}
		{#if $state.editable}
		  <Link self opt={{edit:true}}>EDIT</Link>
		{/if}
		{#if $state.byid}
		  <Link space={$page.val.namespace} title={$page.val.title}>ANCHOR</Link>
		{/if}
		{#if $state.editing}
		  <Link self opt={{edit:undefined}}>CANCEL</Link>
		{/if}
		{#if $state.history}
		  <Link self opt={{history:undefined}}>BACK</Link>
		{/if}
		{#if showany}
			<span class="content-subtitle">&middot;</span>
		{/if}
		<span class="content-subtitle">
			{$state.label}
		</span>
	</FB>
</FB>
</R2Hider>
