<script>
  import FP from './FP.svelte'
  import PP from './PP.svelte'
  import FR from './FR.svelte'
  import { getContext } from 'svelte'
  const hassess = getContext('hassess')
  const session = getContext('session')
</script>

{#if $hassess}
<FR lab="session">
  <PP lab="uuid" val={$session.val.uuid} />
  <PP lab="login" val={$session.val.login} />
  <PP lab="handle" val={$session.val.handle} />
</FR>
{/if}
