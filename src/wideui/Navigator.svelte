<script>
  import FB from '../FB.svelte'
  import Link from '../Link.svelte'
  import WUIModule from './WUIModule.svelte'
  import RecentPages from './RecentPages.svelte'
  import Bookmarks from './Bookmarks.svelte'
  let bookmarks = [
    'Home', 'foo', 'bar', 'CPB:test', 'CPB:forms',
    'CPB:user', 'CPB:login', 'scop:uli', 'foo:bar', 'foo:baz',
    'A Much Longer Title Than The Last One With Capitals'
  ]
</script>

<Bookmarks items={bookmarks} limit={12} lines={3}/>

<RecentPages compact count={10}/>
