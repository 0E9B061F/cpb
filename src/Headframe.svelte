<script>
	import QR from './QR.svelte'
	import FB from './FB.svelte'
	import Logo from './Logo.svelte'
	import Search from './Search.svelte'
	import Bookmarks from './Bookmarks.svelte'
	import UserBar from './UserBar.svelte'
  import {getContext} from 'svelte'
  const gs = getContext('gs')
  const path = getContext('path')
  const session = getContext('session')
  const hassess = getContext('hassess')
</script>

<FB c="head-frame">

  <FB vert>
    {#if $hassess}
      <div class="suuid uuid">{$session.val.uuid}</div>
    {/if}

    <FB c="head-subframe">
			{#if $hassess}
        <QR data={$session.val.uuid} title="Session UUID" scale={2}/>
      {/if}
      <FB expand vert zero>
        <UserBar/>
				<FB expand/>
        <Logo/>
      </FB>
    </FB>
  </FB>

	<FB vert expand>
		<Bookmarks/>
		<FB expand/>
		<Search/>
	</FB>

</FB>

<style>
  .suuid {
    text-align: right;
  }
</style>
