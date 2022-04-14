<script>
  import InfoModule from './InfoModule.svelte'
  import TOC from '../util/TOC.svelte'

  import { getContext } from 'svelte'
  const state = getContext('state')
</script>

<InfoModule>

  <svelte:fragment slot="title">CONTENTS</svelte:fragment>

  <svelte:fragment slot="body">
    <TOC limit={2}/>
  </svelte:fragment>

</InfoModule>
