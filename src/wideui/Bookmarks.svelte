<script>
  import FB from '../FB.svelte'
  import Link from '../Link.svelte'
  import WUIModule from './WUIModule.svelte'
  export let items
  export let limit = 5
  $: it = limit ? items.slice(0, limit) : items
</script>

<WUIModule>
  <svelte:fragment slot="title">BOOKMARKS</svelte:fragment>
  <svelte:fragment slot="body">
    <FB>
      {#each it as nst, i}
        {#if i > 0}<FB>&middot;</FB>{/if}
        <Link {nst} />
      {/each}
    </FB>
  </svelte:fragment>
</WUIModule>
