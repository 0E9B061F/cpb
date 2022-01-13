<script>
  import { getContext, onDestroy } from 'svelte'
  const gs = getContext('gs')
  const path = getContext('path')
  const links = getContext('links')
  const linkmap = getContext('linkmap')
 
  export let space = null
  export let title = null
  export let nst = null
  export let uuid = null

  let href
  if (uuid) href = `/${uuid}`
  else if (nst) {
    const p = nst.split('/')
    const n = p[0]
    const t = p[1]
    space = n || 'main'
    title = t || 'Home'
    if (t) href = `/${n}/${t}`
    else href = `/${n}`
  }
  else {
    if (!space) space = 'main'
    if (!title) title = 'Home'
    nst = `${space}/${title}`
    href = `/${space}/${title}`
  }

  const clicked =()=> {
    $path = href
    window.history.pushState({}, $path, $path)
  }

  const nstc = nst ? nst.replace('/', ':') : null

  console.log(`${space} | ${title} | ${nst} | ${uuid} | ${nstc}`)

  $links = [...$links, nstc || uuid]

  onDestroy(()=> {
    const i = $links.indexOf(nstc || uuid)
    $links.splice(i, 1)
    $links = $links
  })

  $: klass = $linkmap[nstc || uuid] ? 'missing' : ''
</script>

{#if $path == href}
  <span class="current-link" title="you are here"><slot></slot></span>
{:else}
  <a {href} {title} class={klass} on:click|preventDefault={clicked}><slot></slot></a>
{/if}

<style>
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

