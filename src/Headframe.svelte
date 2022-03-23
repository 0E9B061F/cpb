<script>
	import QR from './QR.svelte'
	import FB from './FB.svelte'
	import UUID from './UUID.svelte'
	import Logo from './Logo.svelte'
	import Bookmarks from './Bookmarks.svelte'
	import UserBar from './UserBar.svelte'
	import TitleControls from './TitleControls.svelte'
	import Messenger from './Messenger.svelte'
  import { getContext } from 'svelte'
  const gs = getContext('gs')
  const path = getContext('path')
  const session = getContext('session')
  const hassess = getContext('hassess')
  const state = getContext('state')
  const ui = getContext('ui')
</script>

<FB vert c="head-frame">
	{#if $ui <= 0}
	<FB c="prehead">
		<UserBar/>
		<Messenger/>
	</FB>
	{/if}

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

		<FB vert flip rel>
			<TitleControls/>
		</FB>
  </FB>
</FB>

<style>
  .suuid {
    text-align: right;
  }
</style>
