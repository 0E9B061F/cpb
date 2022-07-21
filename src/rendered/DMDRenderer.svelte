<script>
  import SvelteMarkdown from 'svelte-markdown'

  import CPBLinkShim from './CPBLinkShim.svelte'
  import WikiLink from './WikiLink.svelte'
  import BibleLink from './BibleLink.svelte'
  import Attribution from './Attribution.svelte'
  import ExternalLink from './ExternalLink.svelte'
  //import Section from './Section.svelte'

  import { getContext, setContext } from 'svelte'
  import { marked } from 'marked'
  import dmd from '../../lib/dmd/dmd.js'
  marked.use(dmd)
  const options = marked.defaults
  let slugger = new marked.Slugger()
  setContext('slugger', slugger)

  export let source
  export let inline = false
  export let external = false
  export let onparse =()=> {}

  setContext('external', external)

  const renderers = {
    cpblink: CPBLinkShim,
    extlink: ExternalLink,
    wikilink: WikiLink,
    biblelink: BibleLink,
    
    link: null,
    dash: null,
    attribution: null,
    block: null,
    linedeco: null,
    blockdeco: null,
    pgpkey: null,
    heading: null,
    code: null,
    paragraph: null,
    image: null,
    em: null,
    strong: null,
    codespan: null,
    del: null,
    table: null,
    tablehead: null,
    tablebody: null,
    tablerow: null,
    tablecell: null,
    hr: null,
    html: null,
    blockquote: null,
    br: null,
  }
</script>

<SvelteMarkdown {source} {renderers} {options} on:parsed={onparse} isInline={inline}/>
