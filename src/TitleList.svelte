<script>
  import Link from './Link.svelte'
  import {getContext} from 'svelte'
  const gs = getContext('gs')

  let error, result, noerror, nop

  $: fetch($gs.cmd('titles'))
  .then(res=> res.json())
  .then(res=> {
    error = res.error
    result = res.result
    noerror = (error == 0 || error == undefined)
    nop = $gs.aod
  })
</script>

<div class="title-list">
{#if result}
{#each result as title}
  <Link href="/{title}">{title}</Link>
{/each}
{/if}
</div>

