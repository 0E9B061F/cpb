<script>
	import Link from './Link.svelte'
	import Content from './Content.svelte'
	import TitleList from './TitleList.svelte'
  import {setContext, getContext} from 'svelte'
  import {writable} from 'svelte/store'

  let rc = writable({
    apikey: 'CPBAPI',
    proto: 'http',
    domain: 'localhost',
    port: 3000,
    defns: 'main',
    deftitle: 'Home',
  })
  const burl =()=> `${$rc.proto}://${$rc.domain}${$rc.port ? ':'+$rc.port : ''}`
  const aurl =()=> `${burl()}/${$rc.apikey}`

  let path = writable(window.location.pathname)
  let loc = writable({})

  const parseloc =p=> {
    const loc = {
      namespace: null, title: null, uuid: null
    }
    if (p[0] == '/') p = p.slice(1)
    p = p.split('/')
    const ns = p[0]
    const t = p[1]
    const hex = '[a-fA-F0-9]'
    if (ns.match(`${hex}{8}-(${hex}{4}-){3}${hex}{12}`)) {
      loc.uuid = ns
    } else if (ns == '') {
      loc.namespace = $rc.defns
      loc.title = $rc.deftitle
    } else if (!t) {
      loc.namespace = ns
      loc.title = $rc.deftitle
    } else {
      loc.namespace = ns
      loc.title = t
    }
    return loc
  }

  let gs = writable({
    aod: 0,
    human: path=> {
      if (path == '/' || path == '') {
        return 'Home'
      } else {
        if (path[0] == '/') path = path.slice(1)
        return path.split('/').join(' > ')
      }
    },
    rp: loc=> {
      if (loc.uuid) {
        return `${aurl()}/uuid/${loc.uuid}`
      } else {
        return `${aurl()}/get/${loc.namespace}/${loc.title}`
      }
    },
    cmd: (n, p='')=> `${aurl()}/${n}${p}`,
    full: p=> `${burl()}/${p}`
  })
  let links = writable([])
  let linkmap = writable({})
  
  setContext('rc', rc)
  setContext('gs', gs)
  setContext('links', links)
  setContext('linkmap', linkmap) 
  
  setContext('path', path) 
  setContext('loc', loc) 

  $: $loc = parseloc($path)

  const linkupdate =links=> {
    const titles = [...new Set(links)].join('+')
    const cmd = $gs.cmd('missing', `/${titles}`)
    console.log(`update: ${cmd}`)
    fetch(cmd)
    .then(res=> res.json())
    .then(res=> $linkmap = res)
  }
  let lut
  const mklut =links=> {
    if (lut) clearTimeout(lut)
    lut = setTimeout(linkupdate, 200, links)
  }
  $: mklut($links)
  const onpop =e=> {
    $path = window.location.pathname
  }
  window.onpopstate = onpop

  $: console.log($links)
</script>

<form>
<label for="address">PATH</label>
<input name="address" type="text" bind:value={$path}/>
</form>

<Link nst="main">HOME</Link>
<Link nst="main/foo">foo</Link>
<Link nst="main/bar">bar</Link>
<Link nst="main/Home">HOME 2</Link>
<Link nst="main/FAKE">RED LINK</Link>

<TitleList ns={$loc.namespace}/>
<Content/>

<style>
</style>

