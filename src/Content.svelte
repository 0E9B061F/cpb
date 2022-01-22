<script>
  import History from './History.svelte'
  import PageForm from './PageForm.svelte'
  import Viewer from './Viewer.svelte'
  import { getContext } from 'svelte'
  const session = getContext('session')
  const page = getContext('page')
  const haspage = getContext('haspage')
  const hashistory = getContext('hashistory')
  const hassess = getContext('hassess')
  const loc = getContext('loc')
</script>


{#if $loc.cmd == 'history'}
  <History/>
{:else if $haspage}
  {#if $loc.cmd == 'edit'}
    <PageForm editing/>
  {:else}
    <Viewer/>
  {/if}
{:else if !!$page && $page.err == 1}
  {#if $hassess && $session.val.login}
    <PageForm/>
  {:else}
    <p>no page here. please log in to edit</p>
  {/if}
{:else}
  <p>ERROR</p>
{/if}
