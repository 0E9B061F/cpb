<script>
  import FB from './FB.svelte'
  import WUITOC from './wideui/WUITOC.svelte'
  import RecentPages from './wideui/RecentPages.svelte'
  import SearchBar from './SearchBar.svelte'
  import Text from './doc/Text.svelte'
  import Visibility from './Visibility.svelte'
  import R2Hider from './r2/R2Hider.svelte'
  import Navigator from './wideui/Navigator.svelte'
  import Bookmarks from './wideui/Bookmarks.svelte'
  import UserBar from './UserBar.svelte'
  import Messenger from './Messenger.svelte'
  import { getContext } from 'svelte'

  const state = getContext('state')
  const ui = getContext('ui')
  const rc = getContext('rc')

  export let ghost = false
</script>

{#if $ui >= 2}
<FB vert c="wide-ui" {ghost}>

  <FB vert zero c="wide-head">
    <UserBar mini/>
    <FB c="sbwrap">
      <SearchBar preview auto inf="title" szOpt={5}/>
    </FB>
  </FB>

  {#if $ui >= 3}
    <FB c="wide-menu">
      <Bookmarks limit={null}/>
    </FB>
    <FB spacer={1}/>
  {/if}

  <FB flip={!$rc.sidebar.onRight} c="wide-body">
    <R2Hider hide={!$state.finished}>

      <FB vert c="wide-col wide-col1">
        {#if $ui <= 2}<Navigator/>{/if}
        <WUITOC/>
      </FB>

      {#if $ui >= 3}
        <FB vert c="wide-col wide-col2">
          <RecentPages count={10}/>
        </FB>
      {/if}

    </R2Hider>
  </FB>

</FB>
{/if}
