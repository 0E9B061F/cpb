<script>
  import Link from '../link/Link.svelte'
  import util from '../../lib/util.js'
  import { getContext } from 'svelte'
  const rc = getContext('rc')
  const external = getContext('external')
  export let nst
  export let text = null
  const pclip = /^(:?[^:]+:)?(?<clip>.+) \(/
  const cclip = /^(:?[^:]+:)?(?<clip>[^.,]+)/
  const sclip = /^(:?[^:]+:)?(?<clip>\S+)/
  const clip =t=> {
    let m = t.match(pclip)
    if (m) return m.groups.clip
    m = t.match(cclip)
    if (m) return m.groups.clip
    m = t.match(sclip)
    if (m) return m.groups.clip
    return t
  }
  const mkdisp =d=> tricked ? clip(d) : d
  $: tricked = text === ''
  $: display = (tricked || text) ? mkdisp(text || nst) : null
  $: self = nst == "@"
  $: site = nst === ""
  $: selfanchor = nst[0] == "#" ? nst.slice(1) : null
</script>

{#if selfanchor}
  {#if external}
    {#if display}
      <Link space={external.namespace} title={external.title} cmd={selfanchor}>{display}</Link>
    {:else}
      <Link space={external.namespace} title={external.title} cmd={selfanchor}/>
    {/if}
  {:else}
    {#if display}
      <Link self deopt cmd={selfanchor}>{display}</Link>
    {:else}
      <Link self deopt cmd={selfanchor}/>
    {/if}
  {/if}
{:else if self}
  <Link self strip/>
{:else if display}
  <Link {nst}>{display}</Link>
{:else if site}
  <Link {nst}>{$rc.title}</Link>
{:else}
  <Link {nst}/>
{/if}
