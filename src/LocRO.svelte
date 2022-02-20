c<script>
  import FP from './FP.svelte'
  import PP from './PP.svelte'
  import FR from './FR.svelte'
  import { getContext } from 'svelte'
  const loc = getContext('loc')
</script>

<FR lab="loc">
  {#each Object.entries($loc) as item}
    {#if item[0] == 'opt' && Object.entries(item[1]).length}
      <FR lab="opt">
      {#each Object.entries(item[1]) as i}
        <PP lab={i[0]} val={i[1]}/>
      {/each}
      </FR>
    {:else}
      <PP lab={item[0]} val={item[1]}/>
    {/if}
  {/each}
</FR>
