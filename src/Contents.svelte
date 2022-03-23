<script>
  import FB from './FB.svelte'
  import R2 from './r2/R2.svelte'
  import R2Hider from './r2/R2Hider.svelte'
  import Titleframe from './Titleframe.svelte'
  import Bodyframe from './Bodyframe.svelte'
  import Footer from './Footer.svelte'
  import { getContext } from 'svelte'
  const path = getContext('path')
  const loading = getContext('loading')
  const finished = getContext('finished')
  const editing = getContext('editing')
  const creating = getContext('creating')
  const hashistory = getContext('hashistory')
  const updatescroll = getContext('updatescroll')
  const state = getContext('state')
  const loc = getContext('loc')
  const rc = getContext('rc')
  $: editmode = !!$editing || !!$creating ? 'edit-mode' : ''
  let element
  let waterm
  let ch = 0
  let sh = 0
  let sy = 0
  export let scrollable = false
  let scrolled = false
  export const top =()=> {
    if (element) element.scrollTo({top: 0, behavior: 'smooth'})
  }
  const calcscroll =()=> {
    if (element) {
      ch = element.clientHeight
      sh = element.scrollHeight
      sy = element.scrollTop
      scrollable = sh > ch
      updatescroll(ch, sh, sy, scrollable, scrolled)
    }
  }
  const mobserver = new MutationObserver((list, obs)=> {
    let calc = false
    list.forEach(m=> {
      if (m.type === 'childList') {
        calc = true
      }
    })
    if (calc) calcscroll()
  })
  let iobserver
  $: if (element) {
    mobserver.observe(element, {childList: true, subtree: true})
  } else mobserver.disconnect()
  $: if (element && waterm) {
    iobserver = new IntersectionObserver((entries, obs)=> {
      const ir = entries[entries.length-1].intersectionRatio
      scrolled = ir < 0.1
      updatescroll(ch, sh, sy, scrollable, scrolled)
    }, {
      root: element,
      rootMargin: '0px',
      threshold: 0.1,
    })
    iobserver.observe(waterm)
  } else if (iobserver) iobserver.disconnect()
</script>

<FB vert expand c="cpb-content {editmode}" bind:element={element}>
<R2Hider hide={!$state.finished}>
<div class="watermargin" bind:this={waterm}></div>
{#if !$loading}
  {#if !$editing && !$creating && !$hashistory && $loc.namespace != $rc.syskey}
    <Titleframe/>
  {/if}
  <Bodyframe/>
  <Footer/>
{/if}
</R2Hider>
</FB>
