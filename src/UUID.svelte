<script>
  import Link from './link/Link.svelte'
  export let link = false
</script>

{#if link}
  <span class="uuid"><Link nored uuid={link}>{link}</Link></span>
{:else}
  <span class="uuid"><slot></slot></span>
{/if}
