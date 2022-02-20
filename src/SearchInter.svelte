<script>
  import FB from './FB.svelte'
  export let cond = true
</script>

<FB vert flip>
{#if cond}
  <span class="pagination-inter">&middot;</span>
{:else}
  <span class="pagination-inter"></span>
{/if}
</FB>
