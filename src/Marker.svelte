<script>
  import { getContext, onDestroy } from 'svelte'
  const gs = getContext('gs')
  const trail = getContext('trail')
  const path = getContext('path')
  const links = getContext('links')
  const linkmap = getContext('linkmap')

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
  export let cond = null
  export let does = null
  export let disable = false
  export let marked = false

  if (bounce && typeof(bounce) != 'string') bounce = '/'

  let href
  let ident
  if (self || decmd || nolink) href = null
  else if (bounce) href = $trail[1] || bounce
  else if (special) href = `/CPB/${special}`
  else if (uuid) href = `/${uuid.toUpperCase()}`
  else if (nst) {
    const p = nst.split('/')
    const n = p[0]
    const t = p[1]
    space = n || 'main'
    title = t || 'Home'
    if (t) href = `/${n}/${t}`
    else href = `/${n}`
  } else {
    if (!space) space = 'main'
    if (!title) title = 'Home'
    nst = `${space}/${title}`
    href = `/${space}/${title}`
  }
  const hash = cmd ? `#${cmd}` : ''
  $: if (self) href = $gs.bare($path) + hash
  else if (decmd) href = $gs.bare($path)
  else href += hash
  const nstc = nst ? nst.replace('/', ':') : null
  ident = nstc || uuid

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

  if (!special && !nolink && !bounce && !self && !decmd) {
    if (!ident) throw new Error('broke link')
    $links = [...$links, ident]
  }

  onDestroy(()=> {
    if (!special && !nolink && !bounce && !self && !decmd) {
      const i = $links.indexOf(ident)
      $links.splice(i, 1)
      $links = $links
    }
  })

  $: klass = (!special && !nolink && !!$linkmap.val && !!$linkmap.val[nstc || uuid]) ? 'missing' : ''
</script>

{#if circle}
<svg class="mark" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">
  <circle cx="3" cy="3" r="2.5"/>
</svg>
{:else if text}
<span class="mark uitxt s3txt">{text}</span>
{/if}
