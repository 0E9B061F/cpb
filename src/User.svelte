<script>
  import E401 from './E401.svelte'
  import { getContext } from 'svelte'
  const hasuser = getContext('hasuser')
  const user = getContext('user')
</script>

{#if $hasuser}
  <h1>{$user.val.handle}</h1>
  <p>Circa {$user.val.createdAt}</p>
{:else if !!$user && $user.err == 2}
  <E401/>
{/if}
