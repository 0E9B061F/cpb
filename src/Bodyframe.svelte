<script>
  import Login from './Login.svelte'
  import User from './User.svelte'
  import E401 from './E401.svelte'
  import E404 from './E404.svelte'
  import E500 from './E500.svelte'
  import Content from './Content.svelte'

  import { getContext } from 'svelte'
  const loc = getContext('loc')
  const haslogin = getContext('haslogin')
</script>

{#if $loc.special == 'content'}
  <Content/>
{:else if $loc.special == 'login'}
  {#if !$haslogin}
    <Login/>
  {:else}
    <E401/>
  {/if}
{:else if $loc.special == 'user'}
  {#if $haslogin}
    <User/>
  {:else}
    <E401/>
  {/if}
{:else if $loc.special == 'e404'}
  <E404/>
{:else}
  <E500/>
{/if}
