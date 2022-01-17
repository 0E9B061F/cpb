<script>
	import Link from './Link.svelte'
	import Login from './Login.svelte'
	import Headframe from './Headframe.svelte'
	import Titleframe from './Titleframe.svelte'
	import User from './User.svelte'
	import LocRO from './LocRO.svelte'
	import QR from './QR.svelte'
	import FB from './FB.svelte'
	import Messenger from './Messenger.svelte'
	import Bookmarks from './Bookmarks.svelte'
	import UserBar from './UserBar.svelte'
	import Content from './Content.svelte'
	import TitleList from './TitleList.svelte'
  import {setContext, getContext, onMount} from 'svelte'
  import {writable} from 'svelte/store'
  import Cookies from 'js-cookie'

  let rc = writable({
    syskey: 'CPB',
    proto: 'http',
    domain: 'localhost',
    port: 3000,
    defns: 'main',
    defapi: 'api',
    deftitle: 'Home',
    deflogin: 'login',
    defuser: 'user',
  })
  const burl =()=> `${$rc.proto}://${$rc.domain}${$rc.port ? ':'+$rc.port : ''}`
  const aurl =()=> `${burl()}/${$rc.syskey}/${$rc.defapi}`

  let path = writable(window.location.pathname + window.location.hash)
  let loc = writable({})
  let space = writable('')
  let title = writable('')

  let trail = writable([])
  $: if ($path != $trail[0]) $trail.unshift($path)

  let session = writable({})

  const parseloc =p=> {
    const loc = {
      namespace: null, title: null, uuid: null,
      special: null, cmd: null
    }
    p = p.split('#')
    if (p[1]) loc.cmd = p[1]
    p = p[0]
    if (p[0] == '/') p = p.slice(1)
    p = p.split('/')
    const ns = p[0]
    const t = p[1]
    const hex = '[a-fA-F0-9]'
    if (ns == $rc.syskey) {
      if (t == $rc.deflogin) {
        loc.special = 'login'
      } else if (t == $rc.defuser) {
        loc.special = 'user'
      } else {
        loc.special = '404'
      }
    } else if (ns.match(`${hex}{8}-(${hex}{4}-){3}${hex}{12}`)) {
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
  
  let message = writable({})

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
    full: p=> `${burl()}/${p}`,
    goto: p=> {
      $path = p
      window.history.pushState({}, $path, $path)
    },
    bounce: (d='/')=> {
      $path = trail[1] ? trail[1] : d
      window.history.pushState({}, $path, $path)
    },
    refreshuser: ()=> {
      fetch(`${aurl()}/session`)
      .then(res=> res.json())
      .then(res=> $session = res)
    },
    msg: (text='', level=0)=> {
      $message = { text, level }
    },
    tag: ()=> {
      return `${$loc.namespace}:${$loc.title}`
    },
    bare: ()=> $path.split('#')[0],
    cur: ()=> `${burl()}/${$path}`,
  })
  let links = writable([])
  let linkmap = writable({})
  
  
  setContext('rc', rc)
  setContext('gs', gs)
  setContext('links', links)
  setContext('linkmap', linkmap) 
  
  setContext('path', path) 
  setContext('loc', loc) 
  setContext('space', space) 
  setContext('title', title) 
  
  setContext('session', session)
  setContext('message', message)
  setContext('trail', trail)

  $gs.msg()

  $gs.refreshuser()

  const parsenst =loc=> {
    let ns, t
    if (loc.special) {
      t = loc.special
      ns = 'special'
    }
    if (loc.uuid) t = loc.uuid
    if (loc.namespace) ns = loc.namespace
    if (loc.title) t = loc.title
    $space = ns
    $title = t
  }

  $: $loc = parseloc($path)
  $: parsenst($loc)

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

<FB vert>
<Headframe/>
<Titleframe/>
</FB>



<Messenger/>

<LocRO/>

<TitleList ns={$loc.namespace}/>

{#if $loc.special == 'login'}
  <Login/>
{:else if $loc.special == 'user'}
  <User/>
{:else if $loc.special == '404'}
  <h1>404</h1>
  <p>404 not found</p>
{:else}
  <Content/>
{/if}

<div class="heart-line">&#x2764;</div>

<style>
  .heart-line {
    text-align: center;
    font-size: 2rem;
    margin-top: 3rem;
    margin-bottom: 3rem;
  }
</style>

