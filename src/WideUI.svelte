<script>
  import FB from './FB.svelte'
  import TOC from './wideui/TOC.svelte'
  import RecentPages from './wideui/RecentPages.svelte'
  import SearchBar from './SearchBar.svelte'
  import Visibility from './Visibility.svelte'
  import R2Hider from './r2/R2Hider.svelte'
  import Navigator from './wideui/Navigator.svelte'
  import Bookmarks from './wideui/Bookmarks.svelte'
  import UserBar from './UserBar.svelte'
  import Messenger from './Messenger.svelte'
  import { getContext } from 'svelte'
  const state = getContext('state')
  const ui = getContext('ui')


  let bookmarks = [
    'Home', 'foo', 'bar', 'CPB:test', 'CPB:forms',
    'CPB:user', 'CPB:login', 'scop:uli', 'foo:bar', 'foo:baz',
  ]
</script>

{#if $ui > 0}
<FB vert c="wide-ui">

  <FB c="wide-head">
    <FB vert c="wide-col wide-col1">
      <FB c="sbwrap">
        <SearchBar preview auto inf="title" szOpt={5}/>
      </FB>
      <FB expand end c="prehead">
        <Messenger/>
        <UserBar/>
      </FB>
    </FB>

    {#if $ui > 1}
      <FB vert c="wide-col wide-col2">
      </FB>
    {/if}
  </FB>

  {#if $ui > 1}
    <FB c="wide-menu">
      <Bookmarks items={bookmarks} limit={null}/>
    </FB>
    <FB spacer={1}/>
  {/if}

  <FB c="wide-body">
    <R2Hider hide={!$state.finished}>
    <FB vert c="wide-col wide-col1">
      {#if $ui < 2}<Navigator/>{/if}
      <TOC/>
    </FB>

    {#if $ui > 1}
      <FB vert c="wide-col wide-col2">
        <RecentPages compact count={5}/>
      </FB>
    {/if}
  </R2Hider>
  </FB>

</FB>
{/if}
