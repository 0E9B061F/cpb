<script>
  export let dash
</script>

{#if dash.length <= 2}
  &ndash;
{:else}
  &mdash;
{/if}
