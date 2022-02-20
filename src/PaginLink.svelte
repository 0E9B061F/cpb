<script>
  import FB from './FB.svelte'
  import R2 from './r2/R2.svelte'
  import Link from './Link.svelte'
  import { getContext } from 'svelte'
  const loc = getContext('loc')
  export let pnum
  export let lab = null
  export let enable = true
  export let nolink = false
  $: labelc = lab ? 'labeled' : ''
  let cur = false
  $: flip = !lab || cur || nolink
</script>

{#if nolink}
  <FB vert {flip} c="pagination-link {labelc}">
    <span class="pagination-num">{pnum}</span>
    {#if lab}<span class="pagination-lab">{lab}</span>{/if}
  </FB>
{:else if enable}
  <Link bind:current={cur} special="search" query={$loc.query} {pnum} sz={$loc.opt.sz}>
    <FB vert {flip} c="pagination-link {labelc}">
      <span class="pagination-num">{pnum}</span>
      {#if lab}<span class="pagination-lab">{lab}</span>{/if}
    </FB>
  </Link>
{:else}
  <FB vert c="pagination-link disabled"></FB>
{/if}
