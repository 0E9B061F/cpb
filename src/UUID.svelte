<script>
  import Link from './Link.svelte'
  export let link = false
</script>

{#if link}
  <span class="uuid"><Link uuid={link}>{link}</Link></span>
{:else}
  <span class="uuid"><slot></slot></span>
{/if}
