<script>
  import RecentPages from './RecentPages.svelte'
  import Bookmarks from './Bookmarks.svelte'
</script>

<Bookmarks limit={12} lines={3}/>

<RecentPages compact count={10}/>
