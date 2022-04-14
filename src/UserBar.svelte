<script>
  import Link from './Link.svelte'
  import FB from './FB.svelte'
  import { getContext } from 'svelte'
  const rc = getContext('rc')
  const session = getContext('session')
  const hassess = getContext('hassess')
  const logout = getContext('logout')

  export let mini = false
  export let generic = false
</script>


<FB c="user-bar" fw={7}>
  {#if $hassess}
    {#if $session.val.login}
      <Link nst="CPB:user">
        {#if generic}
          USER
        {:else}
          {$session.val.handle}
        {/if}
      </Link>
    {:else if !$rc.singleuser}
      <span>{#if !generic}{$session.val.handle}{/if}</span>
    {/if}
  {/if}
  {#if mini}<FB>/</FB>{/if}
  {#if $hassess && $session.val.login}
    <Link first={logout} global self info="End your session. We'll be sorry to see you go!">LOGOUT</Link>
  {:else if !$rc.singleuser}
    <Link nst="CPB:login">LOGIN</Link>
    <Link nst="CPB:register">REGISTER</Link>
  {/if}
  {#if mini}<FB expand c="ubmini fill"/>{/if}
</FB>
