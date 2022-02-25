<script>
  import HistoryItem from './HistoryItem.svelte'
  import SearchPagination from './SearchPagination.svelte'
  import { getContext } from 'svelte'
  const history = getContext('history')
  const hashistory = getContext('hashistory')
  const heading = {
    vnum: 'VERSION',
    user: {handle: 'AUTHOR'},
    title: 'TITLE',
    uuid: 'UUID',
  }
</script>

{#if $hashistory}
  <table class="history-items">
  <tr>
    <th>VER.</th>
    <th>USER</th>
    <th>TITLE</th>
    <th class="grow">UUID</th>
  </tr>
  {#each $history.val.items as item}
    <HistoryItem {item} />
  {/each}
  </table>
  <SearchPagination result={$history.val}/>
{/if}
