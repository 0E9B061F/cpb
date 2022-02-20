<script>
  import FB from './FB.svelte'
  import PaginLink from './PaginLink.svelte'
  import SearchInter from './SearchInter.svelte'
  export let neg = false
  export let width = 5
  export let page = 1
  export let pages = 1
  let wing = []
  const rewing =()=> {
    wing = [...Array(width).keys()]
  }
  $: delt = neg ? -1 : 1
  const next =x=> {
    return page + (x * delt) + (2 * delt)
  }
  const cond =x=> {
    const nx = next(x)
    return neg ? nx > 1 : nx < pages
  }
  $: rewing(width, page, pages)
</script>

<FB flip={neg}>
{#each wing as x}
  <PaginLink pnum={next(x)} enable={cond(x)}/>
  <SearchInter
    cond={cond(x) && cond(x+1) && x < width - 1}/>
{/each}
</FB>
