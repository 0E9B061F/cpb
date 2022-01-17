<script>
  import Link from './Link.svelte'
  import {getContext} from 'svelte'
  const gs = getContext('gs')
  const session = getContext('session')
  const dologout =()=> {
    return fetch($gs.cmd('logout'), {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {'Content-Type': 'application/json'},
    }).then(r=> {
      $gs.refreshuser()
      $gs.msg('logged out')
    })
  }
</script>

<div class="user-bar">
  {#if $session.user}
    {#if $session.user.login}
      <Link special="user">{$session.user.handle}</Link>
    {:else}
      <span>{$session.user.handle}</span>
    {/if}
  {/if}
  {#if $session.user && $session.user.login}
    <Link first={dologout} global nolink>LOGOUT</Link>
  {:else}
    <Link special="login">LOGIN / REGISTER</Link>
  {/if}
</div>

<style>
  .user-bar {
    text-align: right;
  }
</style>

