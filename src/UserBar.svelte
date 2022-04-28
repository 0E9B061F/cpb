<script>
  import Link from './link/Link.svelte'
  import FB from './FB.svelte'
  import { getContext } from 'svelte'
  const rc = getContext('rc')
  const session = getContext('session')
  const hassess = getContext('hassess')
  const logout = getContext('logout')

  export let mini = false
</script>

<FB c="user-bar" fw={7} line="s2">
  {#if $rc.singleuser}
    <FB expand c="fill"/>
  {:else}
    {#if $hassess}
      {#if $session.val.login}
        <Link nst="CPB:user">
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
      <Link nst="CPB:login">LOGIN</Link>
      {#if mini && $hassess && !$session.val.login}<FB vc expand c="ubmini fill"/>{/if}
      <Link nst="CPB:register">REGISTER</Link>
    {/if}
  {/if}
</FB>
