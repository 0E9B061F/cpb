<script>
  import FB from './FB.svelte'
  import TOC from './TOC.svelte'
  import RecentPages from './RecentPages.svelte'
  import SearchBar from './SearchBar.svelte'
  import Visibility from './Visibility.svelte'
  import R2Hider from './r2/R2Hider.svelte'
  import Navigator from './wideui/Navigator.svelte'
  import UserBar from './UserBar.svelte'
  import Messenger from './Messenger.svelte'
  import { getContext } from 'svelte'
  const state = getContext('state')
  const ui = getContext('ui')
</script>

{#if $ui > 0}
<FB vert c="wide-ui">
  <R2Hider hide={!$state.finished}>

  <FB c="wide-head">
    <FB vert c="wide-col wide-col1">
      <FB expand end c="prehead">
    		<Messenger/>
        <UserBar/>
    	</FB>
      <FB c="sbwrap">
        <SearchBar preview auto inf="title" szOpt={5}/>
      </FB>
    </FB>

    {#if $ui > 1}
    <FB vert c="wide-col wide-col2">
    </FB>
    {/if}
  </FB>

  <FB c="wide-body">
    <FB vert c="wide-col wide-col1">
      <Navigator/>
      <TOC/>
    </FB>

    {#if $ui > 1}
    <FB vert c="wide-col wide-col2">
    </FB>
    {/if}
  </FB>

</R2Hider>
</FB>
{/if}
