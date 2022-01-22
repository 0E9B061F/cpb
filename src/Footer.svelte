<script>
	import FB from './FB.svelte'
	import Pipe from './Pipe.svelte'
	import Balance from './Balance.svelte'
	import MaybeUUID from './MaybeUUID.svelte'
	import UUID from './UUID.svelte'
  import {getContext} from 'svelte'
  const page = getContext('page')
  const haspage = getContext('haspage')
</script>

<FB c="footer">
  <FB vert>
		{#if $haspage}
		<MaybeUUID right uuid={$page.val.uuid} />
		<MaybeUUID right uuid={$page.val.parentVuuid} />
		{/if}
  </FB>
  <FB expand vert center>
    <div class="heartmark">&#x2764;</div>
  </FB>
  <FB vert>
		{#if $haspage}
		<MaybeUUID left uuid={$page.val.vuuid} />
		<MaybeUUID left uuid={$page.val.childVuuid} />
		{/if}
  </FB>
</FB>
