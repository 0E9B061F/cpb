<script>
  import Link from './Link.svelte'
  import FB from './FB.svelte'
  import SearchBar from './SearchBar.svelte'
  import SearchEmph from './SearchEmph.svelte'
  import SearchPagination from './SearchPagination.svelte'
  import { getContext } from 'svelte'
  const loc = getContext('loc')
  let result
</script>

<FB vert expand>
<SearchBar
  bind:result
  query={$loc.query}
  pnum={$loc.opt.pg}
  size={$loc.opt.sz}
  options
/>

{#if result && result.items}
<FB vert expand c="results search-results">
  <FB c="results-heading">
    <div class="results-cell col1">TITLE</div>
    <div class="results-cell col2">TEXT</div>
  </FB>
  <FB expand vert c="results-items">
    {#each result.items as item}
      <FB c="results-row">
        <div class="results-cell col1 title-header">
          {#if item.namespace != 'main'}
            <span class="ns-header">({item.namespace})</span>
          {/if}
          <Link space={item.namespace} title={item.plain}>
            <SearchEmph text={item.title}/>
          </Link>
        </div>
        <div class="results-cell col2 body-header">
          <SearchEmph text={item.body}/>
        </div>
      </FB>
    {/each}
  </FB>
</FB>
{/if}
<SearchPagination {result}/>
</FB>
