<script>
  import { getContext } from 'svelte'
  const hasuser = getContext('hasuser')
  const user = getContext('user')
</script>

{#if $hasuser}
  <h1>{$user.val.handle}</h1>
  <p>Circa {$user.val.createdAt}</p>
{/if}
