<script>
  import FB from '../FB.svelte'
  import Link from '../Link.svelte'
  import WUIModule from './WUIModule.svelte'
  import RecentPages from './RecentPages.svelte'
  import Bookmarks from './Bookmarks.svelte'
  let bookmarks = [
    'Home', 'foo', 'bar', 'CPB:test', 'CPB:forms'
  ]
</script>

<Bookmarks items={bookmarks} limit={5}/>

<RecentPages compact count={5}/>
