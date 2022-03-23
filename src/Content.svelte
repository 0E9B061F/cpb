<script>
  import History from './History.svelte'
  import PageForm from './PageForm.svelte'
  import Viewer from './Viewer.svelte'
  import E401 from './E401.svelte'
  import E404 from './E404.svelte'
  import E500 from './E500.svelte'
  import { getContext } from 'svelte'
  const session = getContext('session')
  const page = getContext('page')
  const haspage = getContext('haspage')
  const hashistory = getContext('hashistory')
  const haslogin = getContext('haslogin')
  const loc = getContext('loc')
</script>


{#if $loc.opt.history}
  <History/>
{:else if $haspage}
  {#if $loc.opt.edit}
    <PageForm/>
  {:else}
    <Viewer/>
  {/if}
{:else if !!$page}
  <PageForm/>
{:else}
  <p>ERROR</p>
{/if}
