<script>
  import Link from './Link.svelte'
  import FB from './FB.svelte'
  import R2Hider from './r2/R2Hider.svelte'
  import { getContext } from 'svelte'
  const gs = getContext('gs')
  const usedark = getContext('usedark')
  import { onMount } from 'svelte'
  import QRCode from 'qrcode'
  export let data
  export let title = null
  export let uuid = null
  export let scale = 3
  export let margin = 0
  export let ver = 1
  export let mask = null
  $: if (!data) data = uuid
  let canvas
  let hidden = true
  $: color = !!$usedark ? {
    dark: '#d0d0d0ff',
    light: '#25252500'
  } : {
    dark: '#353535ff',
    light: '#ffffff00'
  }
  const generate =data=> {
    if (typeof(data) == 'string') data = data.toUpperCase()
    const opt = {
      errorCorrectionLevel: 'L',
      margin, scale,
      color,
    }
    if (mask) opt.maskPattern = mask
    if (ver) opt.version = ver
    QRCode.toCanvas(canvas, data, opt, display)
  }
  const display =e=> {
    hidden = !!e
    if (e) console.log(e)
  }
  $: size = (17 + (4 * ver)) * scale
  onMount(()=> generate(data))
  $: if (canvas) generate(data, scale, margin, ver, mask, $usedark)
</script>

<FB c="qrcode" rel style={{width: `${size}px`, height: `${size}px`}}>
  <R2Hider hide={hidden} size={0.5}>
    <div slot="inner">
      <span class="uitxt s1txt w5txt">ERR</span>
      {#if size > 65}
        <span class="uitxt s3txt">FAILED TO GENERATE QR CODE</span>
      {:else if size > 50}
        <span class="uitxt s3txt">QR CODE FAILED</span>
      {/if}
    </div>
  </R2Hider>
  <div class="qrcanvas" class:hidden={hidden}>
    {#if uuid}
      <Link {uuid}><canvas bind:this={canvas}></canvas></Link>
    {:else}
      <canvas bind:this={canvas} {title}></canvas>
    {/if}
  </div>
</FB>
