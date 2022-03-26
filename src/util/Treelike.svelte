<script>
  import List from './List.svelte'
  import { setContext, hasContext, getContext } from 'svelte'
  import { writable } from 'svelte/store'

  export let items = []
  export let ordered = true
  export let cutoff = null
  let root = false
  let depth = 1
  let treecut

  if (!hasContext('treelikeroot')) {
    root = 'treelike'
    treecut = writable(null)
    setContext('treecut', treecut)
    setContext('treelikeroot', true)
    setContext('treedepth', 1)
  } else {
    treecut = getContext('treecut')
    depth = getContext('treedepth') + 1
    setContext('treedepth', depth)
  }

  $: if (root) $treecut = cutoff && cutoff < 1 ? 1 : cutoff
</script>

{#if !$treecut || depth <= $treecut}
<List {ordered} {root} {depth}>
  {#each items as item}
    <li>
      {#if Array.isArray(item)}
        <slot item={item[0]}></slot>
        <svelte:self items={item.slice(1)} let:item={i}>
          <slot item={i}></slot>
        </svelte:self>
      {:else}
        <slot item={item}></slot>
      {/if}
    </li>
  {/each}
</List>
{/if}
