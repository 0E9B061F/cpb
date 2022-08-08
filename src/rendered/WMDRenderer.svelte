<script>
  import SvelteMarkdown from 'svelte-markdown'

  import LinkShim from './LinkShim.svelte'
  import CPBLinkShim from './CPBLinkShim.svelte'
  import WikiLink from './WikiLink.svelte'
  import BibleLink from './BibleLink.svelte'
  import Attribution from './Attribution.svelte'
  import ExternalLink from './ExternalLink.svelte'
  import Block from './Block.svelte'
  import Code from './Code.svelte'
  import Decorator from './Decorator.svelte'
  import PGPKey from './PGPKey.svelte'
  import Dash from './Dash.svelte'
  import Heading from './Heading.svelte'
  //import Section from './Section.svelte'

  import { getContext, setContext } from 'svelte'
  import { marked } from 'marked'
  import wmd from '../../lib/wmd/wmd.js'
  marked.use(wmd)
  const options = marked.defaults
  let slugger = new marked.Slugger()
  setContext('slugger', slugger)

  export let source
  export let inline = false
  export let external = false
  export let onparse =()=> {}

  setContext('external', external)

  const citedex = {}
  let citetotal = 0
  let sourcetotal = 0
  const citations = {}
  const sources = {}

  class Citation {
    constructor(ident, detail) {
      this.ident = ident
      this.detail = detail
      this.citeno = citeno(this.ident)
      this.index = indexno()
      this.anchor = `cite-${this.ident}-${this.citeno}`
      this.target = `source-${this.ident}-${this.citeno}`
    }
    get src() {
      return sources[this.ident]
    }
    get srcno() {
      return this.src.index
    }
    decorate(s) { return `🙦${s || this.index}` }
    get display() {
      return this.decorate()
      if (this.src) {
        return `[${this.srcno}:${this.citeno}]`
      } else {
        return '[source missing]'
      }
    }
  }

  class Source {
    constructor(ident) {
      this.ident = ident
      this.index = sourcetotal += 1
    }
    get citations() {
      return citations[this.ident] || []
    }
    get targets() {
      return this.citations.map(c=> c.target)
    }
  }

  const citeno =(ident)=> {
    if (citedex[ident]) return citedex[ident] += 1
    else return citedex[ident] = 1
  }
  const indexno =()=> {
    return citetotal += 1
  }
  const addCitation =(ident, detail)=> {
    const c = new Citation(ident, detail)
    if (!citations[ident]) citations[ident] = []
    citations[ident].push(c)
    return c
  }
  const addSource =(ident)=> {
    sources[ident] = new Source(ident)
    return sources[ident]
  }

  setContext('citeno', citeno)
  setContext('addSource', addSource)
  setContext('addCitation', addCitation)

  const renderers = {
    link: LinkShim,
    cpblink: CPBLinkShim,
    extlink: ExternalLink,
    wikilink: WikiLink,
    biblelink: BibleLink,
    dash: Dash,
    attribution: Attribution,
    block: Block,
    linedeco: Decorator,
    blockdeco: Decorator,
    pgpkey: PGPKey,
    heading: Heading,
    code: Code,
    // section: Section,
  }
</script>

<SvelteMarkdown {source} {renderers} {options} on:parsed={onparse} isInline={inline}/>
