<script>
  import { getContext, onDestroy } from 'svelte'
  const gs = getContext('gs')
  const links = getContext('links')
  const linkmap = getContext('linkmap')
 
  export let href = '/'
  export let title = undefined
  
  const clicked =()=> {
    $gs.path = href
    window.history.pushState({}, $gs.path, $gs.path)
  }

  title = href
  if (title == '/' || title == '') title = 'Home'
  if (title[0] == '/') title = title.slice(1)

  $links = [...$links, title]

  onDestroy(()=> {
    const i = $links.indexOf(title)
    $links.splice(i, 1)
    $links = $links
  })

  $: klass = $linkmap[title] ? 'missing' : ''
</script>

{#if $gs.path == href}
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

