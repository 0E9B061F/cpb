<script>
  import FB from '../FB.svelte'

  export let items = []
  export let limit = null
  export let line = "n"
  export let fw = 4
  export let expand = false
  $: data = limit ? items.slice(0, limit) : items
</script>

<FB c="separated" {line} {fw} {expand}>
  {#each data as item, i}
    {#if i > 0}
      <slot name="separator">
        <div class="separator">&middot;</div>
      </slot>
    {/if}
    <slot {item}></slot>
  {/each}
</FB>
