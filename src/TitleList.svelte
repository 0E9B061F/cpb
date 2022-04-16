<script>
  import Link from './link/Link.svelte'
  import {getContext} from 'svelte'
  const gs = getContext('gs')

  let error, result, noerror, nop

  export let ns = 'main'

  $: fetch($gs.cmd('titles', '/'+ns))
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
  <Link nst="{ns}/{title}">{ns}: {title}</Link>
{/each}
{/if}
</div>

<style>
.title-list {
  display: flex;
  justify-content: space-around;
}
</style>

