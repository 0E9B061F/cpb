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
    firstpage = result.page <= 1
    lastpage = result.page >= result.pages
    prevpage = result.page - 1 > 1
    nextpage = result.page + 1 < result.pages
  }
</script>

{#if result}
  <FB between c="pagination">
    <PaginLink lab="FIRST" pnum={1} enable={!firstpage}/>
    <SearchWing {width} neg page={result.page} pages={result.pages}/>
    <FB c="pagination-center">
      <PaginLink lab="PREV" pnum={result.page - 1} enable={prevpage}/>
      <SearchInter cond={prevpage}/>
      <PaginLink lab="PAGE" pnum={result.page} nolink/>
      <SearchInter cond={nextpage}/>
      <PaginLink lab="NEXT" pnum={result.page + 1} enable={nextpage}/>
    </FB>
    <SearchWing {width} page={result.page} pages={result.pages}/>
    <PaginLink lab="LAST" pnum={result.pages} enable={!lastpage}/>
  </FB>
{/if}
