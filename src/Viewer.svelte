<script>
  import FB from './FB.svelte'
  import Link from './link/Link.svelte'
  import Hardmargin from './margin/Hardmargin.svelte'
  import Infobar from './infobar/Infobar.svelte'
  import ContentControls from './contentctrl/ContentControls.svelte'
  import CPBThumb from './cpb-thumb/CPBThumb.svelte'
  import WMDRenderer from './rendered/WMDRenderer.svelte'

  import { getContext, setContext, onMount, afterUpdate, tick } from 'svelte'
  import { writable } from 'svelte/store'

  const rc = getContext('rc')
  const loc = getContext('loc')
  const state = getContext('state')
  const haspage = getContext('haspage')
  const haslogin = getContext('haslogin')
  const page = getContext('page')
  const setTokens = getContext('setTokens')
  const setBlockInfo = getContext('setBlockInfo')

  let body
  let readTime = ''
  let blocks = {}

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

  function onparse(e) {
    setTokens(e.detail.tokens)
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
    body?.querySelectorAll('.cpb-heading').forEach(b=> {
      blocks[b.id] = new BlockInfo(b)
    })
    setBlockInfo(blocks)
  })

  const parseq =hl=> {
    return hl.split('+').map(x=> x.replace(/_+/g, ' '))
  }

  let shl

  $: if (body) {
    if ($loc.opts.hl != shl) {
      shl = $loc.opts.hl
      if (shl) {
        const hls = parseq(shl)
      }
    }
  }
  $: image = $haspage && $page.val.resource.type == 'image'
</script>

{#if $haspage}
  <FB c="cpb-viewer">
    <Hardmargin/>
    <div class="rendered" bind:this={body}>
      {#if $haslogin}<ContentControls/>{/if}
      <Infobar/>
      {#if $state.uuid}
        <FB rel c="mountinfo">
          <FB fw={9} center abs c="notabene">
            <FB vert center>NB</FB>
          </FB>
          {#if $state.old}
            <FB vc line="n">was</FB>
            <FB vc title line="b3" fw={6}>{$state.namespace}:{$state.title}</FB>
          {:else}
            <FB vc line="n">mounted at</FB>
            <FB vc title line="b3" fw={6}><Link space={$state.namespace} title={$state.title}/></FB>
          {/if}
        </FB>
      {/if}
      {#if image}
        <div class="image-viewer">
          <CPBThumb image={$page.val} thumb={768} pad={256} hint={false}/>
        </div>
      {/if}
      <WMDRenderer source={$page.val.source} {onparse}/>
    </div>
  </FB>
{/if}
