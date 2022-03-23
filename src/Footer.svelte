<script>
	import FB from './FB.svelte'
	import Link from './Link.svelte'
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
			<MaybeUUID right uuid={$page.val.pageUuid} />
			<MaybeUUID right uuid={$page.val.prevUuid} />
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
			<MaybeUUID left uuid={$page.val.uuid} />
			<MaybeUUID left uuid={$page.val.nextUuid} />
		{/if}
  </FB>
</FB>
