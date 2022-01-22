<script>
  import Login from './Login.svelte'
  import User from './User.svelte'
  import E404 from './E404.svelte'
  import E500 from './E500.svelte'
  import Content from './Content.svelte'

  import { getContext } from 'svelte'
  const loc = getContext('loc')
</script>

{#if $loc.special == 'content'}
  <Content/>
{:else if $loc.special == 'login'}
  <Login/>
{:else if $loc.special == 'user'}
  <User/>
{:else if $loc.special == 'e404'}
  <E404/>
{:else}
  <E500/>
{/if}
