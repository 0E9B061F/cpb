<script>
  import Link from './Link.svelte'
  import LinkShim from './LinkShim.svelte'
  import CPBLinkShim from './CPBLinkShim.svelte'
  import ContentControls from './ContentControls.svelte'
  import Infobar from './infobar/Infobar.svelte'
  import { marked } from 'marked'
  import { convert } from 'html-to-text'
  import { getContext } from 'svelte'
  import extensions from '../lib/wmd.js'
  const rc = getContext('rc')
  const haspage = getContext('haspage')
  const page = getContext('page')
  const setTokens = getContext('setTokens')
  const setPageinfo = getContext('setPageinfo')
  import SvelteMarkdown from 'svelte-markdown'

  marked.use({extensions})
  const options = marked.defaults

  const renderers = {
    link: LinkShim,
    cpblink: CPBLinkShim,
  }
  let body
  let wc = 0
  let links = 0
  let readTime = ''
  let info = null

  const countlinks =tokens=> {
    tokens.forEach(token=> {
      if (token.type == 'cpblink') links += 1
      if (token.tokens) countlinks(token.tokens)
    })
  }

  function onparse(e) {
    links = 0
    console.log(e.detail.tokens)
    setTokens(e.detail.tokens)
    const txt = convert(body.innerHTML)
    wc = txt.trim().split(/\s+/).length
    const m = wc / $rc.readSpeed
    if (m < 2) readTime = 'a minute'
    else readTime =  `${Math.ceil(m)} minutes`
    countlinks(e.detail.tokens)

    setPageinfo(wc, readTime, links)
  }
  import { onMount } from 'svelte'
  onMount(()=> console.log('bar'))
</script>

{#if $haspage}
  <div class="rendered" bind:this={body}>
    <ContentControls/>
    <Infobar/>
    <SvelteMarkdown source={$page.val.body} {renderers} {options} on:parsed={onparse} />
  </div>
{/if}
