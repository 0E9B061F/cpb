<script>
  import LinkMark from './LinkMark.svelte'
  import { getContext, onDestroy } from 'svelte'
  const gs = getContext('gs')
  const trail = getContext('trail')
  const path = getContext('path')
  const links = getContext('links')
  const linkmap = getContext('linkmap')
  const loading = getContext('loading')
  const haslogin = getContext('haslogin')
  const session = getContext('session')
  const loc = getContext('loc')

  export let space = null
  export let title = null
  export let nst = null
  export let uuid = null
  export let special = null
  export let cmd = null
  export let first = null
  export let global = false
  export let bounce = false
  export let nolink = false
  export let self = false
  export let decmd = false
  export let recmd = false
  export let cond = null
  export let does = null
  export let disable = false
  export let marked = false
  export let user = false
  export let query = null

  let href
  let ident
  let reddable = false

  const goto =p=> {
    if (does) does()
    if (!nolink) $gs.goto(href)
  }
  const nav =()=> {
    if (first) first().then(r=> goto(href))
    else goto(href)
  }
  const clicked =()=> {
    if (cond) {
      cond().then(r=> { if (r) nav() })
    } else nav()
  }

  const register =id=> {
    if (reddable) {
      if (!id) throw new Error('broke link')
      $links = [...$links, id]
    }
  }

  const deregister =id=> {
    if (!id) return
    const n = $links.indexOf(id)
    if (n < 0) return
    $links.splice(n, 1)
    $links = $links
  }

  const parsenst =()=> {
    const [n, t] = nst.split('/')
    space = n || 'main'
    title = t || 'Home'
  }

  const trace =()=> {
    href = $trail[1] || bounce
  }

  const follow =()=> {
    uuid = $loc.uuid
    space = $loc.namespace
    title = $loc.title
    special = $loc.special
    query = $loc.query
    user = $loc.user
    cmd = $loc.cmd
    mkhref()
  }

  const mkhref =()=> {
    if (recmd) cmd = recmd
    if (nolink) href = null
    else if (uuid) href = `/${uuid.toUpperCase()}`
    else if (title) {
      href = `/${space}/${title}`
    } else if (space) {
      href = `/${space}`
    } else if (special == 'content') {
      href = `/`
    } else if (special == 'user') {
      if (user) href = `/~${user}`
      else {
        if (!!$haslogin) href = `/~${$session.val.handle}`
        else href = '/~'
      }
    } else if (special) {
      href = `/CPB/${special}`
      if (special == 'search' && query) {
        href = `${href}/${query}`
      }
    }

    if (cmd && !decmd) href = `${href}#${cmd}`
  }

  const mkident =()=> {
    if (uuid) ident = uuid
    else if (title) {
      ident = `${space}:${title}`
    } else if (space) {
      ident = space
    } else ident = null
    register(ident)
  }

  export const trigger =()=> clicked()

  $: if (!special && !nolink && !bounce && !self && !decmd && !global) {
    reddable = true
  } else {
    reddable = false
    deregister(ident)
  }
  $: if (bounce && typeof(bounce) != 'string') bounce = '/'
  $: if (nst) parsenst(nst)
  else if (self || decmd) follow($loc)
  else if (bounce) trace($trail)
  $: mkhref(
    space, title, uuid, special, cmd,
    global, nolink, disable, user, query
  )
  $: mkident(uuid, space, title)

  onDestroy(()=> deregister(ident))

  $: klass = (!special && !nolink && !global && !!$linkmap.val && !!$linkmap.val[ident]) ? 'missing' : ''
</script>
{#if disable}
  <span class="cpblink disabled-link" title="disabled">
    {#if marked}<LinkMark/>{/if}
    <slot></slot>
  </span>
{:else if nolink}
  <span class="cpblink nolink" {title} on:click={clicked}>
    {#if marked}<LinkMark/>{/if}
    <slot></slot>
  </span>
{:else if !global && $path == href}
  <span class="cpblink current-link" title="you are here">
    {#if marked}<LinkMark/>{/if}
    <slot></slot>
  </span>
{:else}
  <a {href} {title} class="cpblink {klass}" on:click|preventDefault={clicked}>
    {#if marked}<LinkMark/>{/if}
    <slot></slot>
  </a>
{/if}

<style>
  .nolink {
    cursor: pointer;
  }
  a {
    color: #6e7fd2;
  }
  a.missing {
    color: #de2657
  }
  .current-link {
    font-weight: bold;
  }
  .disabled-link {
    color: #a1a8cf;
  }
</style>
