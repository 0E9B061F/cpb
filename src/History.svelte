<script>
  import HistoryItem from './HistoryItem.svelte'
  import { getContext } from 'svelte'
  const history = getContext('history')
  const hashistory = getContext('hashistory')
</script>

{#if $hashistory}
  <table class="history-items">
  {#each $history.val as item}
    <HistoryItem {item} />
  {/each}
  </table>
{/if}
