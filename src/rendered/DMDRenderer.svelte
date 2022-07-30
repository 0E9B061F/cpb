<script>
  import SvelteMarkdown from 'svelte-markdown'

  import CPBLinkShim from './CPBLinkShim.svelte'
  import WikiLink from './WikiLink.svelte'
  import BibleLink from './BibleLink.svelte'
  import Attribution from './Attribution.svelte'
  import ExternalLink from './ExternalLink.svelte'
  import Directory from './dmd/Directory.svelte'
  import Subdirectory from './dmd/Subdirectory.svelte'
  import DirectoryItem from './dmd/DirectoryItem.svelte'
  import SubDirectoryItem from './dmd/SubDirectoryItem.svelte'
  import Dirlabel from './dmd/Dirlabel.svelte'
  import Intro from './dmd/Intro.svelte'
  //import Section from './Section.svelte'

  import { getContext, setContext } from 'svelte'
  import { marked } from 'marked'
  import lexer from '../../lib/dmd/lexer.js'
  let slugger = new marked.Slugger()
  setContext('slugger', slugger)

  export let source
  export let inline = false
  export let external = false
  export let onparse =()=> {}
  export let menu = false

  setContext('external', external)
  setContext('menu', menu)

  let opened = null
  const menuopen =(m)=> {
    if (opened) opened()
    opened = m
  }
  const mo = getContext('menuopen')
  if (!mo) setContext('menuopen', menuopen)

  const renderers = {
    cpblink: CPBLinkShim,
    extlink: ExternalLink,
    wikilink: WikiLink,
    biblelink: BibleLink,

    intro: menu ? null : Intro,
    directory: Directory,
    subdirectory: Subdirectory,
    directory_item: DirectoryItem,
    subdirectory_item: SubDirectoryItem,
    dirlabel: Dirlabel,

    // paragraph: null,
    link: null,
    //dash: null,
    attribution: null,
    block: null,
    //linedeco: null,
    blockdeco: null,
    pgpkey: null,
    heading: null,
    code: null,
    image: null,
    //em: null,
    //strong: null,
    //codespan: null,
    //del: null,
    table: null,
    tablehead: null,
    tablebody: null,
    tablerow: null,
    tablecell: null,
    hr: null,
    html: null,
    blockquote: null,
    //br: null,
  }

  $: tokens = lexer(source)
</script>

<SvelteMarkdown source={tokens} {renderers} on:parsed={onparse} isInline={inline}/>
