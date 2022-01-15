<script>
  import FT from './FT.svelte'
  import FI from './FI.svelte'
  import { getContext } from 'svelte'
  const loc = getContext('loc')
</script>

<FT c="readout location-ro">
  <FI lab="SPACE">{$loc.namespace}</FI>
  <FI lab="TITLE">{$loc.title}</FI>
  <FI lab="UUID">{$loc.uuid}</FI>
  <FI lab="SPEC">{$loc.special}</FI>
  <FI lab="CMD">{$loc.cmd}</FI>
</FT>

