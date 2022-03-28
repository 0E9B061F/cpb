<script>
  import Link from './Link.svelte'
  import LinkShim from './LinkShim.svelte'
  import CPBLinkShim from './CPBLinkShim.svelte'
  import { marked } from 'marked'
  import { convert } from 'html-to-text'
  import { getContext } from 'svelte'
  import extensions from '../lib/wmd.js'
  const rc = getContext('rc')
  const haspage = getContext('haspage')
  const page = getContext('page')
  const setTokens = getContext('setTokens')
  import SvelteMarkdown from 'svelte-markdown'

  console.log(`!!!!!!!!!!!!!!!!! ${extensions}`)

  marked.use({extensions})
  const options = marked.defaults

  const renderers = {
    link: LinkShim,
    cpblink: CPBLinkShim,
  }
  let body
  let wc = 0
  let readTime = ''

  function onparse(e) {
    console.log(e.detail.tokens)
    setTokens(e.detail.tokens)
    const txt = convert(body.innerHTML)
    wc = txt.trim().split(/\s+/).length
    const m = wc / $rc.readSpeed
    if (m < 2) readTime = 'a minute'
    else readTime =  `${Math.ceil(m)} minutes`
  }
  import { onMount } from 'svelte'
  onMount(()=> console.log('bar'))
</script>

{#if $haspage}
  <div class="rendered" bind:this={body}>
    <div class="infobar">
      foo
    </div>
    <SvelteMarkdown source={$page.val.body} {renderers} {options} on:parsed={onparse} />
  </div>
  <p>vnum: {$page.val.vnum}</p>
  <p>wc: {wc}</p>
  <p>read time: {readTime}</p>
{/if}
