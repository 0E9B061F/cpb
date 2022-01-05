<script>
	import Link from './Link.svelte'
	import Content from './Content.svelte'
	import TitleList from './TitleList.svelte'
  import {setContext, getContext} from 'svelte'
  import {writable} from 'svelte/store'

  let gs = writable({
    path: '/',
    aod: 0,
    human: path=> {
      if (path == '/' || path == '') {
        return 'Home'
      } else {
        if (path[0] == '/') path = path.slice(1)
        return path.split('/').join(' > ')
      }
    },
    rp: p=> `http://localhost:3000/CPB.get${p}`,
    cmd: (n, p='')=> `http://localhost:3000/CPB.${n}${p}`,
  })
  setContext('gs', gs)
  
  const retrieve =path=> { 
  }
</script>

<form>
<label for="address">PATH</label>
<input name="address" type="text" bind:value={$gs.path}/>
</form>

<Link href="/">HOME</Link>
<Link href="/foo">foo</Link>
<Link href="/bar">bar</Link>
<Link href="/Home">HOME 2</Link>

<TitleList/>
<Content/>

<style>
</style>

