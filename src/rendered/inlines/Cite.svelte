<script>
  import signature from '../../../lib/signature.js'
  import Link from '../../link/Link.svelte'

  import { getContext } from 'svelte'
  const addCitation = getContext('addCitation')
  const loc = getContext('loc')
  const external = getContext('external')

  export let args

  $: sig = signature.consume(args, ['ident', ['detail', null], ['mark', false]])
  $: cite = addCitation(sig.get('ident'), sig.get('detail'))
  $: current = $loc.cmd == cite.anchor
  $: mark = sig.get('mark') && !current
</script>

<span class="citation" class:marked={mark} class:current={current} id={cite.anchor}>
  <span class="citation-text"><slot></slot></span>{#if cite}<span class="citation-link system">{#if external}<Link space={external.namespace} title={external.title} cmd={cite.target}><span class="cite-marker">🙣</span>{cite.index}</Link>{:else}<Link self cmd={cite.target}><span class="cite-marker">🙣</span>{cite.index}</Link>{/if}</span>{/if}
</span>
