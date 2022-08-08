<script>
  import FB from './FB.svelte'
  import Alert from './Alert.svelte'
  import Link from './link/Link.svelte'
  import Hardmargin from './margin/Hardmargin.svelte'
  import Infobar from './infobar/Infobar.svelte'
  import ContentControls from './contentctrl/ContentControls.svelte'
  import CPBThumb from './cpb-thumb/CPBThumb.svelte'
  import WMDRenderer from './rendered/WMDRenderer.svelte'
  import DMDRenderer from './rendered/DMDRenderer.svelte'
  import Menubar from './Menubar.svelte'

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

  $: alertspecial = $loc.special && $haslogin
  $: alertmount = $loc.uuid
  $: hasalerts = alertspecial || alertmount
</script>

{#if $haspage}
  <FB c="cpb-viewer">
    <Hardmargin/>
    <div class="rendered" bind:this={body}>
      {#if $haslogin}<ContentControls/>{/if}
      <Infobar/>
      <Menubar/>
      {#if hasalerts}
        <div class="alerts">
          {#if alertspecial}
            <Alert head="RESERVED LOCATION" message="The system uses this location to {$loc.special.purpose}. A {$loc.special.type} is expected."/>
          {/if}
          {#if alertmount}
            <Alert>
              <svelte:fragment slot="head">
                {#if $state.old}
                  was {$state.namespace}:{$state.title}
                {:else}
                  mounted at <Link space={$state.namespace} title={$state.title}/>
                {/if}
              </svelte:fragment>
            </Alert>
          {/if}
        </div>
      {/if}
      {#if image}
        <div class="image-viewer">
          <CPBThumb image={$page.val} thumb={768} pad={256} hint={false}/>
        </div>
      {/if}
      {#if $page.val.resource.type == 'directory'}
        <DMDRenderer source={$page.val.source} {onparse}/>
      {:else}
        <WMDRenderer source={$page.val.source} {onparse}/>
      {/if}
    </div>
  </FB>
{/if}
