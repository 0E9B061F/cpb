<script>
	import FB from './FB.svelte'
	import Link from './Link.svelte'
	import MaybeUUID from './MaybeUUID.svelte'
  import { getContext } from 'svelte'
  const page = getContext('page')
  const haspage = getContext('haspage')
  const editing = getContext('editing')
  const creating = getContext('creating')
  const postdraft = getContext('postdraft')
</script>

<FB c="footer">
  <FB vert>
		{#if !!$editing}
			<Link decmd>CANCEL</Link>
		{:else if $haspage}
			<MaybeUUID right uuid={$page.val.pageUuid} />
			<MaybeUUID right uuid={$page.val.prevUuid} />
		{/if}
  </FB>
  <FB expand vert center>
    <div class="heartmark">&#x2764;</div>
  </FB>
  <FB vert>
		{#if !!$editing || !!$creating}
			<Link self global first={postdraft}>SAVE</Link>
		{:else if $haspage}
			<MaybeUUID left uuid={$page.val.uuid} />
			<MaybeUUID left uuid={$page.val.nextUuid} />
		{/if}
  </FB>
</FB>
