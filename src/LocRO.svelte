<script>
  import FP from './FP.svelte'
  import PP from './PP.svelte'
  import FR from './FR.svelte'
  import { getContext } from 'svelte'
  const loc = getContext('loc')
</script>

<FR lab="loc">
  <PP lab="space" val={$loc.namespace} />
  <PP lab="title" val={$loc.title} />
  <PP lab="uuid" val={$loc.uuid} />
  <PP lab="special" val={$loc.special} />
  <PP lab="cmd" val={$loc.cmd} />
</FR>
