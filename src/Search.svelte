<script>
	import FB from './FB.svelte'
	import Link from './Link.svelte'
  import {getContext} from 'svelte'
  const gs = getContext('gs')
  const path = getContext('path')
  let exists = false
</script>

<FB form flip>
  <input type="text" />
  <Link nolink>SEARCH</Link>
  {#if exists}
    <Link nolink>GO</Link>
  {:else}
    <Link nolink>CREATE</Link>
  {/if}
</FB>

<style>
  input {
    line-height: 1.8rem;
  }
  input {
    height: 1.8rem;
  }
</style>
