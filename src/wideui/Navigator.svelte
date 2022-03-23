<script>
  import FB from '../FB.svelte'
  import Link from '../Link.svelte'
  import RecentPages from '../RecentPages.svelte'
  let bookmarks = [
    'Home', 'foo', 'bar', 'CPB:test', 'CPB:forms'
  ]
</script>

<FB vert>
  <FB line="b2" fw="7">BOOKMARKS</FB>
  <FB>
    {#each bookmarks as nst, i}
      {#if i > 0}<FB>&middot;</FB>{/if}
      <Link {nst} />
    {/each}
  </FB>
  <RecentPages compact count={5}/>
</FB>
