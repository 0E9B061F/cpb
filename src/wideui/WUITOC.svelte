<script>
  import WUIModule from './WUIModule.svelte'
  import WUIButton from './WUIButton.svelte'
  import TOC from '../util/TOC.svelte'
  import TopButton from '../util/TopButton.svelte'

  import { getContext } from 'svelte'
  const state = getContext('state')
  const scrollinfo = getContext('scrollinfo')
</script>

{#if $state.content}
  <WUIModule>

    <svelte:fragment slot="title">CONTENTS</svelte:fragment>

    <svelte:fragment slot="controls">
      {#if $scrollinfo.scrollable}
        <WUIButton><TopButton/></WUIButton>
      {/if}
    </svelte:fragment>

    <svelte:fragment slot="body">
      <TOC/>
    </svelte:fragment>

  </WUIModule>
{/if}
