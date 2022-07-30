<script>
  import DMDRenderer from './rendered/DMDRenderer.svelte'
  import FB from './FB.svelte'
  import Alert from './Alert.svelte'
  import Link from './link/Link.svelte'
  import { setContext, getContext } from 'svelte'
  import CPB from '../lib/cpb.js'

  const loc = getContext('loc')
  const rc = getContext('rc')
  const grab = getContext('grab')
  const haslogin = getContext('haslogin')

  const menuapi =(ns)=> {
    return ns ? `${ns}:menu` : ':menu'
  }

  let sitenstu = CPB.NSTU.parse(menuapi())
  let nsnstu = null
  let sitedata
  let nsdata
  let nsfor
  let sitecur = false
  let nscur = false

  const mknstu =()=> {
    nsnstu = $loc.namespace ? CPB.NSTU.parse(menuapi($loc.namespace)) : null
  }
  const getdata =()=> {
    if (!sitedata) {
      grab('nstu', siteurl).then(ver=> sitedata = ver)
    }
    if (nsdata && nsfor != $loc.namespace) nsdata = null
    if ($loc.namespace && $loc.namespace != nsfor) {
      grab('nstu', nsurl).then(ver=> {
        nsdata = ver
        nsfor = $loc.namespace
      })
    }
  }
  const curr =()=> {
    sitecur = sitenstu.same($loc)
    nscur = nsnstu?.same($loc)
  }

  let opened = null

  const menuopen =(m)=> {
    if (opened) opened()
    opened = m
  }
  setContext('menuopen', menuopen)

  const siteurl = menuapi()
  $: nsurl = $loc.namespace ? menuapi($loc.namespace) : null

  $: mknstu($loc)
  $: curr($loc)
  $: getdata($loc)
</script>

<div class="menubar">
  {#if !sitecur && sitedata && !sitedata.err}
    <Alert>
      <svelte:fragment slot="icon">
        <Link disable={!$haslogin} nst=":menu">SITE</Link>
      </svelte:fragment>
      <svelte:fragment slot="body">
        <FB para="s1"><DMDRenderer menu source={sitedata.val.source}/></FB>
      </svelte:fragment>
    </Alert>
  {/if}
  {#if !nscur && nsdata && !nsdata.err}
    <Alert>
      <svelte:fragment slot="icon">
        <Link disable={!$haslogin} nst={nsnstu.normal}>NS</Link>
      </svelte:fragment>
      <svelte:fragment slot="body">
        <FB para="s1"><DMDRenderer menu source={nsdata.val.source}/></FB>
      </svelte:fragment>
    </Alert>
  {/if}
</div>
