<script>
  import Link from './Link.svelte'
  import { getContext, setContext, hasContext } from 'svelte'
  const slugger = getContext('slugger')
  let root = false
  if (!hasContext('treelikeroot')) {
    root = true
    setContext('treelikeroot', true)
  }
  export let items = []
</script>


<ol class:treelike={root}>
  {#each items as i}
    {#if typeof(i) == 'string'}
      <li>
        <Link nored self cmd={$slugger.slug(i)}>{i}</Link>
      </li>
    {:else}
      {#if typeof(i[1]) == 'number'}
        <li>
          <Link nored self cmd={$slugger.slug(i[0])}>{i[0]}</Link>
          <span class="toc-plus">+</span>
        </li>
      {:else}
        <li>
          <Link nored self cmd={$slugger.slug(i[0])}>{i[0]}</Link>
          <svelte:self items={i.slice(1)}/>
        </li>
      {/if}
    {/if}
  {/each}
</ol>
