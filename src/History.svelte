<script>
  import HistoryItem from './HistoryItem.svelte'
  import {getContext} from 'svelte'
  const gs = getContext('gs')
  export let page
  let items

  $: url = $gs.cmd('history', '/'+page.title)
  const request =u=> {
    fetch(u).then(res=> res.json()).then(res=> {
      items = res
      console.log(items)
    })
  }
  $: request(url)
</script>

{#if items}{#each items as item}
  <HistoryItem {item} />
{/each}{/if}

