<script>
	import FB from './FB.svelte'
	import Link from './Link.svelte'
  import {getContext} from 'svelte'
  const gs = getContext('gs')
  const path = getContext('path')
  let exists = false
</script>

<FB>
  <input type="text" />
  <Link nolink>SEARCH</Link>
  {#if exists}
    <Link nolink>GO</Link>
  {:else}
    <Link nolink>CREATE</Link>
  {/if}
</FB>
