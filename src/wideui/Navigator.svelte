<script>
  import FB from '../FB.svelte'
  import Link from '../Link.svelte'
  import WUIModule from './WUIModule.svelte'
  import RecentPages from '../RecentPages.svelte'
  let bookmarks = [
    'Home', 'foo', 'bar', 'CPB:test', 'CPB:forms'
  ]
</script>

<WUIModule>
  <svelte:fragment slot="title">BOOKMARKS</svelte:fragment>
  <svelte:fragment slot="body">
    <FB>
      {#each bookmarks as nst, i}
      {#if i > 0}<FB>&middot;</FB>{/if}
      <Link {nst} />
      {/each}
    </FB>
  </svelte:fragment>
</WUIModule>

<RecentPages compact count={5}/>
