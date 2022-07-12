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
