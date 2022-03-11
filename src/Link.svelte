<script>
  import LinkMark from './LinkMark.svelte'
  import { getContext, onDestroy } from 'svelte'
  const gs = getContext('gs')
  const rc = getContext('rc')
  const trail = getContext('trail')
  const path = getContext('path')
  const links = getContext('links')
  const linkmap = getContext('linkmap')
  const loading = getContext('loading')
  const haslogin = getContext('haslogin')
  const session = getContext('session')
  const loc = getContext('loc')
  const reload = getContext('reload')

  import util from '../lib/util.js'

  // Home
  // main:Home
  // main:Home?history
  // foo/bar
  // main:foo/bar/baz
  // main:foo/bar/baz?edit
  // CPB:login
  // CPB:search/xxx
  // CPB:search/xxx?pg=2&sz=50

  // main:blog/3
  // main:blog/content/The_First_Post

  export let nst = null

  export let space = null
  export let title = null
  export let uuid = null
  export let cmd = null
  export let sub = null
  export let opt = null

  export let self = false
  export let bounce = false

  export let first = null
  export let cond = null
  export let does = null

  export let global = false
  export let nored = false
  export let nolink = false
  export let disable = false
  export let silent = null

  export let marked = false
  export let c = []
  export let current = false
  export let info = null
  export let dbg = false

  let href
  let ident
  let reddable = false
  let scratch = {sub: [], opt: {}}
  let special = false
  let cls = ''
  let rinfo = ''

  export let addr = href

  const goto =p=> {
    if (does) does()
    if (!nolink) {
      if (!current) $gs.goto(href)
      else reload()
    }
  }
  const nav =()=> {
    if (first) first().then(r=> goto(href))
    else goto(href)
  }
  const clicked =()=> {
    if (disable || (current && !global)) return
    if (cond) cond().then(r=> { if (r) nav() })
    else nav()
  }

  const register =id=> {
    if (reddable) {
      if (!id) throw new Error(`broke link: ${href} ${space} ${title}`)
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

  // foo
  // main:foo
  // main:
  const parsenst =()=> {
    if (nst) {
      const nt = nst.split(':')
      if (nt.length > 1) {
        scratch.space = nt[0]
        if (nt[1]) scratch.title = nt[1]
      } else {
        scratch.space = $rc.defns
        scratch.title = nt[0]
      }
    }
  }

  const trace =()=> {
    return $trail[1] || bounce || '/'
  }
  const follow =()=> {
    scratch.space = $loc.namespace
    scratch.title = $loc.title
    scratch.uuid = $loc.uuid
    scratch.sub = $loc.sub
    scratch.cmd = $loc.cmd
    scratch.opt = $loc.opt
  }

  const preload =()=> {
    if (space) scratch.space = space
    if (title) scratch.title = title
    if (uuid) scratch.uuid = uuid
    if (sub) {
      if (Array.isArray(sub)) scratch.sub = sub
      else if (typeof(sub) == 'string') scratch.sub = sub.split('/')
      else scratch.sub = [sub]
    }
    if (cmd) scratch.cmd = cmd
    if (opt) scratch.opt = Object.assign({}, scratch.opt, opt)
  }

  const mkhref =()=> {
    if (bounce) {
      href = trace()
      return
    }
    scratch = {sub: [], opt: {}}
    special = false
    if (self) follow()
    preload()
    parsenst()
    mkident()

    if (scratch.space == $rc.syskey) special = true

    if (nolink) href = null
    else if (scratch.uuid) {
      const u = scratch.uuid.toUpperCase()
      href = `/${u}`
      rinfo = u
    } else if (scratch.space == $rc.syskey && scratch.title == 'user') {
      rinfo = `User:`
      if (scratch.sub[0]) {
        href = `/~${scratch.sub[0]}`
        rinfo = `${rinfo} ${scratch.sub[0]}`
        if (!!$haslogin && scratch.sub[0] == $session.val.handle) {
          rinfo = `${rinfo} (you)`
        }
      } else if (!!$haslogin) {
        href = `/~${$session.val.handle}`
        rinfo = `${rinfo} ${$session.val.handle} (you)`
      } else {
        href = '/~'
        rinfo = `${rinfo} you`
      }
    } else if (scratch.title) {
      const sp = scratch.space || $rc.defns
      href = `/${sp}/${scratch.title}`
      rinfo = util.tag(sp, scratch.title)
    } else if (scratch.space) {
      href = `/${scratch.space}`
      rinfo = util.tag(scratch.space)
    } else {
      href = `/`
      rinfo = rc.title
    }
    if (scratch.space == $rc.syskey) href = ([href, ...scratch.sub]).join('/')
    if (scratch.opt) {
      href = `${href}${util.mkq(scratch.opt)}`
      if (scratch.space != $rc.syskey) {
        if (scratch.opt.history) rinfo = `(HISTORY) ${rinfo}`
        else if (scratch.opt.edit) rinfo = `(EDIT) ${rinfo}`
      }
    }
    if (scratch.cmd) href = `${href}#${scratch.cmd}`

    current = $path == href

    if (info) rinfo = info
    if (current && !global) rinfo = `${rinfo} (current)`

    addr = href
  }

  const mkident =()=> {
    if (scratch.uuid) ident = scratch.uuid
    else if (scratch.title) {
      ident = `${scratch.space}:${scratch.title}`
    } else if (scratch.space) {
      ident = scratch.space
    } else ident = null
    register(ident)
  }

  const mkcls =()=> {
    const cc = [...c, 'cpblink']
    if (reddable && !!$linkmap.val && !!$linkmap.val[ident]) cc.push('missing')
    if (silent) cc.push('silent')
    if (disable) cc.push('disabled-link')
    if (nolink) cc.push('nolink')
    if (!global && current) cc.push('current-link')
    cls = cc.join(' ')
  }

  export const trigger =()=> clicked()

  $: if (self) {
    mkhref(
      space, title, uuid, cmd, sub, opt,
      self, global, nolink, disable, sub,
      bounce, nst, $loc,
    )
  } else {
    mkhref(
      space, title, uuid, cmd, sub, opt,
      self, global, nolink, disable, sub,
      bounce, nst,
    )
  }
  $: current = $path == href
  $: if (!special && !nolink && !bounce && !self && !global && !silent && !current && !nored) {
    reddable = true
  } else {
    reddable = false
    deregister(ident)
  }
  $: mkcls(reddable, silent, disable, nolink, current, !!$linkmap.val && !!$linkmap.val[ident])

  onDestroy(()=> deregister(ident))
</script>

{#if disable || nolink || (current && !global)}
  <span class={cls} title={rinfo} on:click={clicked}>
    {#if marked}<LinkMark/>{/if}
    <slot></slot>
  </span>
{:else}
  <a {href} title={rinfo} class={cls} on:click|preventDefault={clicked}>
    {#if marked}<LinkMark/>{/if}
    <slot></slot>
  </a>
{/if}
{#if dbg}<span>{href}</span>{/if}

<style>
  .nolink {
    cursor: pointer;
  }
  .current-link, .disabled-link {
    font-weight: 600;
  }
  .disabled-link {
    color: #303030;
    cursor: default;
  }
</style>
