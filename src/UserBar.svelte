<script>
  import Link from './Link.svelte'
  import { getContext } from 'svelte'
  const session = getContext('session')
  const hassess = getContext('hassess')
  const logout = getContext('logout')
</script>

<div class="user-bar">
  {#if $hassess}
    {#if $session.val.login}
      <Link special="user">{$session.val.handle}</Link>
    {:else}
      <span>{$session.val.handle}</span>
    {/if}
  {/if}
  {#if $hassess && $session.val.login}
    <Link first={logout} global self>LOGOUT</Link>
  {:else}
    <Link special="login">LOGIN / REGISTER</Link>
  {/if}
</div>

<style>
  .user-bar {
    text-align: right;
  }
</style>
