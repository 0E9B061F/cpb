<script>
  import Link from './link/Link.svelte'
  import FB from './FB.svelte'
  import PaginLink from './PaginLink.svelte'
  import SearchInter from './SearchInter.svelte'
  import SearchWing from './SearchWing.svelte'
  export let result = null
  export let width = 5


  let firstpage, lastpage, prevpage, nextpage
  $: if (result) {
    firstpage = result.opt.pg <= 1
    lastpage = result.opt.pg >= result.opt.pp
    prevpage = result.opt.pg - 1 > 1
    nextpage = result.opt.pg + 1 < result.opt.pp
  }
</script>

{#if result}
  <FB between c="pagination">
    <PaginLink lab="FIRST" pnum={1} enable={!firstpage}/>
    <SearchWing {width} neg page={result.opt.pg} pages={result.opt.pp}/>
    <FB c="pagination-center">
      <PaginLink lab="PREV" pnum={result.opt.pg - 1} enable={prevpage}/>
      <SearchInter cond={prevpage}/>
      <PaginLink lab="PAGE" pnum={result.opt.pg} nolink/>
      <SearchInter cond={nextpage}/>
      <PaginLink lab="NEXT" pnum={result.opt.pg + 1} enable={nextpage}/>
    </FB>
    <SearchWing {width} page={result.opt.pg} pages={result.opt.pp}/>
    <PaginLink lab="LAST" pnum={result.opt.pp} enable={!lastpage}/>
  </FB>
{/if}
