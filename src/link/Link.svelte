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

  import util from '../../lib/util.js'

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
  export let txtmark = false
  export let c = []
  export let current = false
  export let info = null

  export let decmd = false
  export let deopt = false
  export let strip = false

  export let external = false

  let href
  let ident
  let text
  let reddable = false
  let scratch = {sub: [], opt: {}}
  let special = false
  let cls = ''
  let rinfo = ''
  let registered

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

  const register =()=> {
    if ((!reddable && registered) || (!ident && registered)) deregister()
    else {
      if (reddable && registered != ident) {
        if (registered) {
          deregister(registered)
        }
        registered = ident
        $links = [...$links, ident]
      }
    }
  }
  const deregister =()=> {
    if (!registered) return
    const n = $links.indexOf(registered)
    if (n < 0) return
    $links.splice(n, 1)
    registered = null
    $links = $links
  }

  // foo
  // main:foo
  // main
  const nstreg = /^(?:(?<space>[^:]+):)?(?<title>[^#]+)?(?:#(?<cmd>.+))?/

  const parsenst =()=> {
    if (nst) {
      const m = nst.match(nstreg)
      if (m) {
        scratch.space = m.groups.space || $rc.defns
        scratch.title = m.groups.title || $rc.deftitle
        scratch.cmd = m.groups.cmd
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
    if (decmd | strip) scratch.cmd = null
    if (deopt | strip) scratch.opt = {}
  }

  const mkhref =()=> {
    if (external) {
      href = external
      return
    } else if (bounce) {
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
      rinfo = $rc.title
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

    href = href.replace(/ /g, '_')

    current = $path == href

    if (info) rinfo = info
    if (current && !global) rinfo = `${rinfo} (current)`

    addr = href
  }

  const parsecmd =c=> {
    return c.split('-').map(x=> x[0].toUpperCase()+x.slice(1)).join(' ')
  }

  const mkident =()=> {
    if (nolink) {
      ident = null
      text = 'BUTTON'
    } else if (scratch.uuid) {
      ident = scratch.uuid
      text = scratch.uuid
    } else if (scratch.title) {
      ident = `${scratch.space}:${scratch.title}`
      if ($loc.namespace != scratch.space) {
        text = `${scratch.space}:${scratch.title}`
      } else {
        text = `${scratch.title}`
      }
    } else if (scratch.space) {
      ident = scratch.space
      text = `${scratch.space}::`
    } else {
      ident = `${$rc.defns}:${$rc.deftitle}`
      if ($loc.namespace != $rc.defns) {
        text = `${$rc.defns}:${$rc.deftitle}`
      } else {
        text = `${$rc.deftitle}`
      }
    }
    if (scratch.cmd) {
      const c = parsecmd(scratch.cmd)
      text += ` § ${c}`
    }
    console.log(text)
    register(ident)
  }

  const mkcls =()=> {
    const cc = [...c, 'cpblink']
    if (reddable && !!$linkmap.val && !!$linkmap.val[ident]) cc.push('missing')
    if (silent) cc.push('silent')
    if (disable) cc.push('disabled-link')
    if (nolink) cc.push('nolink')
    if (external) cc.push('external')
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
  $: if (!special && !nolink && !bounce && !self && !global && !silent && !current && !nored && !external) {
    reddable = true
  } else {
    reddable = false
  }
  $: register(ident, reddable)
  $: mkcls(reddable, silent, disable, nolink, current, !!$linkmap.val && !!$linkmap.val[ident])

  onDestroy(()=> deregister())
</script>

{#if disable || nolink || (current && !global)}
  <span class={cls} title={rinfo} on:click={clicked}>{#if marked}<LinkMark/>{/if}<span class="cpblink-text"><slot>{text}</slot></span>{#if txtmark}<span class="txtmark">{txtmark}</span>{/if}</span>
{:else if external}
  <a {href} title={rinfo} class={cls}>{#if marked}<LinkMark/>{/if}<span class="cpblink-text"><slot>{text}</slot></span>{#if txtmark}<span class="txtmark">{txtmark}</span>{/if}</a>
{:else}
  <a {href} title={rinfo} class={cls} on:click|preventDefault={clicked}>{#if marked}<LinkMark/>{/if}<span class="cpblink-text"><slot>{text}</slot></span>{#if txtmark}<span class="txtmark">{txtmark}</span>{/if}</a>
{/if}
