<script>
  import Link from '../link/Link.svelte'
  import FB from '../FB.svelte'
  import SearchBar from '../SearchBar.svelte'
  import SearchEmph from '../SearchEmph.svelte'
  import SearchPagination from '../SearchPagination.svelte'
  import CPBThumb from '../cpb-thumb/CPBThumb.svelte'
  import { getContext } from 'svelte'
  const rc = getContext('rc')
  const loc = getContext('loc')
  export let namespace = null
  let result
  let uiOpt = parseInt($loc.opt.ui) || $rc.searchDefaults.ui
  const thinfo =(thumb, rel)=> {
    return { thumb, rel }
  }
  const thumb =(ver, wanted)=> {
    let out = null
    let found = null
    if (wanted > ver.image.max) return thinfo(false, ver.image.rel)
    ver.image.thumbnails.forEach(t=> {
      if (t.thumb == wanted) out = t.rel
      else if (t.thumb < wanted && (!found || t.thumb > found.thumb)) {
        found = t
      }
    })
    return thinfo(true, out) || thinfo(true, found?.rel) || thinfo(false, ver.image.rel)
  }
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
  <FB vert expand c="results search-results results-ui-{uiOpt}">
    {#each result.val as item}
      {#if uiOpt == 0}
        <div class="search-result">
          {#if item.resource.type == 'image'}
            <CPBThumb image={item} thumb={64} anchor pad={false} fixw/>
          {/if}
          <div class="result-title">
            {#if item.namespace != 'main'}<Link space={item.namespace}/>{/if}
            <Link space={item.namespace} title={item.title} nored>
              <SearchEmph text={item.search.title || item.title}/>
            </Link>
          </div>
          <div class="result-type blacktag">
            {item.resource.type}
          </div>
          <div class="result-text">
            <SearchEmph text={item.search.source}/>
          </div>
        </div>
      {:else if uiOpt == 1}
        <FB c="search-result">
          <FB solid c="result-title">
            <Link space={item.namespace} title={item.title} nored>
              {#if item.namespace != 'main'}<span class="ns-header">{item.namespace}{#if item.namespace && item.namespace[0] != '~'}:{/if}</span>{/if}<SearchEmph text={item.search.title || item.title}/>
            </Link>
          </FB>
          <div class="result-text">
            <SearchEmph text={item.search.source}/>
          </div>
        </FB>
      {/if}
    {/each}
  </FB>
{/if}
<SearchPagination {result}/>
</FB>
