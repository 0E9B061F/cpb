<script>
	import FB from './FB.svelte'
	import Link from './link/Link.svelte'
	import Pipe from './Pipe.svelte'
	import MaybeUUID from './MaybeUUID.svelte'
  import { getContext } from 'svelte'
  const page = getContext('page')
  const haspage = getContext('haspage')
  const editing = getContext('editing')
  const creating = getContext('creating')
  const postdraft = getContext('postdraft')
  const state = getContext('state')
</script>

<FB c="footer">
  <FB vert>
		{#if $state.content}
			<FB>
				<MaybeUUID right uuid={$page.val.pageUuid}/>
				<FB vert center><span class="foot-label">PAGE</span></FB>
			</FB>
			<FB>
				<MaybeUUID right uuid={$page.val.prevUuid}/>
				<FB vert center><span class="foot-label">PREV</span></FB>
			</FB>
		{:else}
			<Pipe expand/>
		{/if}
  </FB>
  <FB expand vert center>
    <div class="heartmark">&#x2764;</div>
  </FB>
  <FB vert>
		{#if $state.creating}
			<Link self global first={postdraft}>CREATE</Link>
		{:else if $state.editing}
			<Link self global first={postdraft} opt={{edit: undefined}}>SAVE</Link>
		{:else if $state.content}
			<FB>
				<FB vert center><span class="foot-label">VERS</span></FB>
				<MaybeUUID left uuid={$page.val.uuid}/>
			</FB>
			<FB>
				<FB vert center><span class="foot-label">NEXT</span></FB>
				<MaybeUUID left uuid={$page.val.nextUuid}/>
			</FB>
		{/if}
  </FB>
</FB>
