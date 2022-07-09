<script>
  import FB from '../FB.svelte'
  import Link from '../link/Link.svelte'
  import ThumbFrame from './ThumbFrame.svelte'
  import CPB from '../../lib/cpb.js'

  export let image
  export let thumb = 64
  export let nstu = null
  export let pad = false
  export let fixed = false
  export let fixw = false
  export let fixh = false
  export let caption = null
  export let anchor = false

  const pickthumb =(ver, wanted)=> {
    let out = null
    let found = null
    if (wanted > ver.image.max) return ver.image
    ver.image.thumbnails.forEach(t=> {
      if (t.thumb == wanted) out = t
      else if (t.thumb < wanted && (!found || t.thumb > found.thumb)) {
        found = t
      }
    })
    return out || found || ver.image
  }
  let classes = []
  let style = {}
  const mkc =()=> {
    const c = ['cpb-thumb']
    const s = {}
    if (linked) c.push('linked-thumb')
    if (pad) c.push(`padded-${pad}`)
    s['--framew'] = `${framew}px`
    s['--frameh'] = `${frameh}px`
    if (fixed) c.push(`fixed-thumb`)
    else {
      if (fixw) c.push(`fixw-thumb`)
      if (fixh) c.push(`fixh-thumb`)
    }
    if (thumb && (fixed || fixw || fixh)) {
      s['--fixedw'] = `${thumb}px`
      s['--fixedh'] = `${thumb}px`
    } else {
      s['--fixedw'] = `${framew}px`
      s['--fixedh'] = `${frameh}px`
    }
    if (thumb) s['--thsize'] = `${thumb}px`
    classes = c
    style = s
  }

  $: selected = pickthumb(image, thumb)
  $: framew = pad ? Math.max(pad, selected.x) : selected.x
  $: frameh = pad ? Math.max(pad, selected.y) : selected.y
  $: anchored = anchor ? new CPB.NSTU({namespace: image.namespace, title: image.title}) : null
  $: linked = nstu || anchored || selected.thumb
  $: mkc(thumb, linked, pad, selected)
</script>

{#if nstu || anchored}
  <Link nst={nstu || anchored} nored>
    <ThumbFrame {classes} {style} {selected} {image}/>
  </Link>
{:else if selected.thumb}
  <Link external={image.image.rel} nored>
    <ThumbFrame {classes} {style} {selected} {image}/>
  </Link>
{:else}
  <ThumbFrame {classes} {style} {selected} {image}/>
{/if}
