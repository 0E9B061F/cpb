<script>
  import Link from '../link/Link.svelte'
  import FB from '../FB.svelte'
  import SearchBar from '../SearchBar.svelte'
  import SearchEmph from '../SearchEmph.svelte'
  import SearchPagination from '../SearchPagination.svelte'
  import { getContext } from 'svelte'
  const loc = getContext('loc')
  export let namespace = null
  let result
</script>

<FB vert expand>
<SearchBar
  bind:result
  {namespace}
  query={$loc.opt.q}
  pgOpt={$loc.opt.pg}
  szOpt={$loc.opt.sz}
  inf={$loc.opt.inf}
  inhOpt={$loc.opt.inh}
  options
/>

{#if result && result.val}
  <FB vert expand c="results search-results">
    <FB c="results-heading">
      <div class="results-cell col1">TITLE</div>
      <div class="results-cell col2">TEXT</div>
    </FB>
    <FB expand vert c="results-items">
      {#each result.val as item}
        <FB c="results-row">
          <div class="results-cell col1 title-header">
            <Link space={item.namespace} title={item.title} nored>
              {#if item.namespace != 'main'}<span class="ns-header">{item.namespace}{#if item.namespace && item.namespace[0] != '~'}:{/if}</span>{/if}<SearchEmph text={item.search.title || item.title}/>
            </Link>
          </div>
          <div class="results-cell col2 body-header">
            <SearchEmph text={item.search.source}/>
          </div>
        </FB>
      {/each}
    </FB>
  </FB>
{/if}
<SearchPagination {result}/>
</FB>
