<script>
	import QR from './QR.svelte'
	import FB from './FB.svelte'
	import UUID from './UUID.svelte'
	import Logo from './Logo.svelte'
	import Bookmarks from './Bookmarks.svelte'
	import UserBar from './UserBar.svelte'
	import TitleControls from './TitleControls.svelte'
	import Messenger from './Messenger.svelte'
	import SearchBar from './SearchBar.svelte'
  import { getContext } from 'svelte'
  const gs = getContext('gs')
  const path = getContext('path')
  const session = getContext('session')
  const hassess = getContext('hassess')
  const state = getContext('state')
  const ui = getContext('ui')
</script>

<FB vert={$ui > 0} c="head-frame">
{#if $ui <= 0}
	<FB vert between>
		<UserBar/>
		<Logo/>
	</FB>
	<FB expand vert zero>
		<FB between expand>
			<FB ve>
				{#if $state.namespace}
      		<FB line="s2" fw={6} c="title-sub">{$state.namespace}</FB>
				{/if}
      	<FB vc line="s4" fw={6}>&#9654;</FB>
			</FB>
			<SearchBar preview auto inf="title" szOpt={5}/>
		</FB>
		<FB between>
			<FB line="b3" fw={8} c="title-main">{$state.title}</FB>
			<FB vert end>
				<TitleControls/>
			</FB>
		</FB>
	</FB>
{:else}
  <FB c="head-subframe">

		<Logo/>

		<FB expand vert zero end>
			<FB>
				{#if $state.namespace}
      		<FB line="s2" fw={6} c="title-sub">{$state.namespace}</FB>
				{/if}
				<FB vert center>
      		<FB line="s4" fw={6}>&#9654;</FB>
				</FB>
			</FB>
      <FB line="b3" fw={8} c="title-main">{$state.title}</FB>
    </FB>

		<FB vert end rel>
			<TitleControls/>
		</FB>

  </FB>
{/if}
</FB>
