<script>
  import FB from './FB.svelte'
  import Link from './link/Link.svelte'
  import Hardmargin from './margin/Hardmargin.svelte'
  import LinkShim from './rendered/LinkShim.svelte'
  import CPBLinkShim from './rendered/CPBLinkShim.svelte'
  import WikiLink from './rendered/WikiLink.svelte'
  import BibleLink from './rendered/BibleLink.svelte'
  import Figure from './rendered/Figure.svelte'
  import Attribution from './rendered/Attribution.svelte'
  import ExternalLink from './rendered/ExternalLink.svelte'
  import Block from './rendered/Block.svelte'
  import Decorated from './rendered/Decorated.svelte'
  import PGPKey from './rendered/PGPKey.svelte'
  import ContentControls from './ContentControls.svelte'
  import Infobar from './infobar/Infobar.svelte'
  import Dash from './rendered/Dash.svelte'
  import Heading from './rendered/Heading.svelte'
  import Section from './rendered/Section.svelte'
  import SvelteMarkdown from 'svelte-markdown'
  import { marked } from 'marked'
  import { convert } from 'html-to-text'
  import { getContext, setContext, onMount, afterUpdate, tick } from 'svelte'
  import { writable } from 'svelte/store'
  import wmd from '../lib/wmd.js'

  const rc = getContext('rc')
  const haspage = getContext('haspage')
  const haslogin = getContext('haslogin')
  const page = getContext('page')
  const setTokens = getContext('setTokens')
  const setPageinfo = getContext('setPageinfo')
  const setBlockInfo = getContext('setBlockInfo')

  let slugger = new marked.Slugger()
  setContext('slugger', slugger)

  const citations = writable({})
  setContext('citations', citations)

  marked.use({extensions: wmd.extensions})
  const options = marked.defaults
  options.walkTokens = wmd.walkTokens

  const renderers = {
    link: LinkShim,
    cpblink: CPBLinkShim,
    extlink: ExternalLink,
    wikilink: WikiLink,
    biblelink: BibleLink,
    dash: Dash,
    figure: Figure,
    attribution: Attribution,
    block: Block,
    decorated: Decorated,
    multidec: Decorated,
    pgpkey: PGPKey,
    heading: Heading,
    section: Section,
  }
  let body
  let wc = 0
  let links = 0
  let readTime = ''
  let info = null
  let blocks = {}

  const countlinks =tokens=> {
    tokens.forEach(token=> {
      if (token.type == 'cpblink') links += 1
      if (token.tokens) countlinks(token.tokens)
    })
  }

  function onparse(e) {
    links = 0
    setTokens(e.detail.tokens)
    const txt = convert(body.innerHTML)
    wc = txt.trim().split(/\s+/).length
    const m = wc / $rc.readSpeed
    if (m < 2) readTime = 'a minute'
    else readTime =  `${Math.ceil(m)} minutes`
    countlinks(e.detail.tokens)

    setPageinfo(wc, readTime, links)
  }

  class BlockInfo {
    constructor(el) {
      this.id = el.id
      this.y = el.offsetTop
      this.h = el.scrollHeight
    }
  }

  afterUpdate(async ()=> {
    await tick()
    body.querySelectorAll('.cpb-heading').forEach(b=> {
      blocks[b.id] = new BlockInfo(b)
    })
    setBlockInfo(blocks)
    console.log(blocks)
  })
</script>

{#if $haspage}
  <FB c="cpb-viewer">
    <Hardmargin/>
    <div class="rendered" bind:this={body}>
      {#if $haslogin}<ContentControls/>{/if}
      <Infobar/>
      <SvelteMarkdown source={$page.val.body} {renderers} {options} on:parsed={onparse} />
    </div>
  </FB>
{/if}
