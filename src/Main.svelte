<script>
	import Link from './Link.svelte'
  import {setContext, getContext} from 'svelte'
  import {writable} from 'svelte/store'

  let gs = writable({path: '/'})
  setContext('gs', gs)
  
  const retrieve =path=> { 
  }
</script>

<p>PATH: {$gs.path}</p>

<Link href="/foo/bar">foo</Link>

<style>
  p {
    color: red
  }
</style>

