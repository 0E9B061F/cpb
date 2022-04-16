<script>
  import LinkMark from './LinkMark.svelte'
  export let marked
  export let txtmark
  export let text
</script>

{#if marked}
  <LinkMark/>
{/if}

<span class="cpblink-text">
  <slot>{text}</slot>
</span>

{#if txtmark}
  <span class="txtmark">&nbsp;{txtmark}</span>
{/if}
