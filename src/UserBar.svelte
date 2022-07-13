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
      {#if $session.val.user.session.login}
        <Link nst="~{$session.val.user.session.handle}">
          {#if mini}
            USER
          {:else}
            {$session.val.user.session.handle}
          {/if}
        </Link>
      {:else if !$rc.singleuser}
        {#if !mini}<span>{$session.val.user.session.handle}</span>{/if}
      {/if}
    {/if}

    {#if mini && $hassess && $session.val.user.session.login}<FB vc expand c="ubmini fill"/>{/if}

    {#if $hassess && $session.val.user.session.login}
      <Link first={logout} global self info="End your session. We'll be sorry to see you go!">LOGOUT</Link>
    {:else if !$rc.singleuser}
      <Link nored system="login">LOGIN</Link>
      {#if mini && $hassess && !$session.val.user.session.login}<FB vc expand c="ubmini fill"/>{/if}
      <Link nored system="register">REGISTER</Link>
    {/if}
  {/if}
</FB>
