<script>
  import Link from './link/Link.svelte'
  import FB from './FB.svelte'
  import { getContext } from 'svelte'
  const rc = getContext('rc')
  const session = getContext('session')
  const hassess = getContext('hassess')
  const haslogin = getContext('haslogin')
  const logout = getContext('logout')

  export let mini = false
</script>

<FB c="user-bar" fw={7} line="s2">
  {#if $rc.singleuser && !$haslogin}
    <FB expand c="fill"/>
  {:else}
    {#if $hassess}
      {#if $session.val.login}
        <Link nst="~{$session.val.handle}">
          {#if mini}
            USER
          {:else}
            {$session.val.handle}
          {/if}
        </Link>
      {:else if !$rc.singleuser}
        {#if !mini}<span>{$session.val.handle}</span>{/if}
      {/if}
    {/if}

    {#if mini && $hassess && $session.val.login}<FB vc expand c="ubmini fill"/>{/if}

    {#if $hassess && $session.val.login}
      <Link first={logout} global self info="End your session. We'll be sorry to see you go!">LOGOUT</Link>
    {:else if !$rc.singleuser}
      <Link system="login">LOGIN</Link>
      {#if mini && $hassess && !$session.val.login}<FB vc expand c="ubmini fill"/>{/if}
      <Link system="register">REGISTER</Link>
    {/if}
  {/if}
</FB>
