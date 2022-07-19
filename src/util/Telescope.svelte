<script>
  export let items
  $: head = items[0]
  $: tail = items.slice(1)
</script>

<div id={head}>
  {#if tail.length}
    <svelte:self items={tail}>
      <slot></slot>
    </svelte:self>
  {:else}
    <slot></slot>
  {/if}
</div>
