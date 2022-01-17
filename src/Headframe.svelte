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
</script>

<FB>

  <FB vert expand>
    <Search/>
    <Bookmarks/>
  </FB>

  <FB vert>
    {#if $session.uuid}
      <div class="suuid uuid">{$session.uuid}</div>
    {/if}

    <FB grid>
      <FB expand vert>
        <FB leaf expand><UserBar/></FB>
        <Logo/>
      </FB>
      {#if $session.uuid}
        <QR data={$session.uuid} title="Session UUID" scale={2}/>
      {/if}
    </FB>
  </FB>
</FB>

<style>
  .suuid {
    text-align: right;
  }
</style>

