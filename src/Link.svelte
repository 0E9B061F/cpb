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

  if (bounce && typeof(bounce) != 'string') bounce = '/'

  let href
  if (self || decmd || nolink) href = null
  else if (bounce) href = $trail[1] || bounce
  else if (special) href = `/CPB/${special}`
  else if (uuid) href = `/${uuid}`
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

  const goto =p=> {
    if (!nolink) $gs.goto(href)
  }

  const clicked =()=> {
    if (first) first().then(r=> goto(href))
    else goto(href)
  }

  const nstc = nst ? nst.replace('/', ':') : null

  if (!special) $links = [...$links, nstc || uuid]

  onDestroy(()=> {
    if (!special) {
      const i = $links.indexOf(nstc || uuid)
      $links.splice(i, 1)
      $links = $links
    }
  })

  $: klass = (!special && !nolink && $linkmap[nstc || uuid]) ? 'missing' : ''
</script>
{#if nolink}
  <span class="cpblink nolink" {title} on:click={clicked}>
    <svg class="mark" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">
      <circle cx="3" cy="3" r="2.5"/>
    </svg>
    <slot></slot>
  </span>
{:else if !global && $path == href}
  <span class="cpblink current-link" title="you are here">
    <div class="mark"></div>
    <slot></slot>
  </span>
{:else}
  <a {href} {title} class="cpblink {klass}" on:click|preventDefault={clicked}>
    <div class="mark"></div>
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
    border-bottom: 1px dotted black;
  }
</style>
