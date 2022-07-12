<script>
  import SvelteMarkdown from 'svelte-markdown'

  import LinkShim from './LinkShim.svelte'
  import CPBLinkShim from './CPBLinkShim.svelte'
  import WikiLink from './WikiLink.svelte'
  import BibleLink from './BibleLink.svelte'
  import Figure from './Figure.svelte'
  import Attribution from './Attribution.svelte'
  import ExternalLink from './ExternalLink.svelte'
  import Block from './Block.svelte'
  import Decorated from './Decorated.svelte'
  import PGPKey from './PGPKey.svelte'
  import Dash from './Dash.svelte'
  import Heading from './Heading.svelte'
  //import Section from './Section.svelte'

  import { getContext, setContext } from 'svelte'
  import { marked } from 'marked'
  import wmd from '../../lib/wmd.js'
  marked.use(wmd)
  const options = marked.defaults
  let slugger = new marked.Slugger()
  setContext('slugger', slugger)

  export let source
  export let inline = false
  export let external = false
  export let onparse =()=> {}

  setContext('external', external)

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
    // section: Section,
  }
</script>

<SvelteMarkdown {source} {renderers} {options} on:parsed={onparse} isInline={inline}/>
