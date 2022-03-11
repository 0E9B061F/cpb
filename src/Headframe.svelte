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
  const space = getContext('space')
  const title = getContext('title')
</script>

<FB vert c="head-frame">
	<FB between c="prehead">
		{#if !!$hassess}<UUID>{$session.val.uuid}</UUID>{/if}
		<FB>
		<Messenger/>
		<UserBar/>
		</FB>
	</FB>

  <FB c="head-subframe">
		{#if $hassess}
			<QR data={$session.val.uuid} ver={2} title="Session UUID" scale={2}/>
		{/if}
    <FB vert zero>
			<Logo/>
			<div class="logofill"></div>
    </FB>
		<FB expand vert between zero>
			<FB>
      	<div class="title-sub">{$space}</div>
				<FB vert center>
					<span class="ns-sep uitxt s3txt">&#9654;</span>
				</FB>
			</FB>
      <div class="title-main">{$title}</div>
    </FB>
		<FB vert flip>
			<TitleControls/>
		</FB>
  </FB>
</FB>

<style>
  .suuid {
    text-align: right;
  }
</style>
