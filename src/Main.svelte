<script>
	import Link from './Link.svelte'
	import Content from './Content.svelte'
  import {setContext, getContext} from 'svelte'
  import {writable} from 'svelte/store'

  let gs = writable({
    path: '/',
    human: path=> {
      if (path == '/' || path == '') {
        return 'Home'
      } else {
        if (path[0] == '/') path = path.slice(1)
        return path.split('/').join(' > ')
      }
    }
  })
  setContext('gs', gs)
  
  const retrieve =path=> { 
  }
</script>

<p>PATH: {$gs.path}</p>

<Link href="/foo/bar">foo</Link>
<Link href="/foo/baz">baz</Link>

<Content/>

<style>
  p {
    color: red
  }
</style>

