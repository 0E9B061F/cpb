<script>
  import Link from '../../link/Link.svelte'
  import { getContext } from 'svelte'
  const loc = getContext('loc')
  export let cite
  $: current = $loc.cmd == cite.target
</script>

<span class="source-cite" class:current={current}>{#if cite.detail}{cite.detail} {/if}<Link self cmd={cite.anchor}>{cite.decorate(cite.citeno)}</Link></span>
