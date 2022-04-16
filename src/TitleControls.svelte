<script>
	import FB from './FB.svelte'
	import Link from './link/Link.svelte'
	import R2Hider from './r2/R2Hider.svelte'
  import { getContext } from 'svelte'
  const loading = getContext('loading')
  const finished = getContext('finished')
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

<FB vert zero>
	<FB line title>
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
