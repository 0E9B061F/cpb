<script>
  import Link from './Link.svelte'
  import Reticle from './Reticle.svelte'
  import { getContext } from 'svelte'
  const gs = getContext('gs')
  import { onMount } from 'svelte'
  import QRCode from 'qrcode'
  export let data
  export let title = null
  export let uuid = null
  export let scale = 3
  export let margin = 0
  export let ver = 1
  export let mask = 7
  $: if (!data) data = uuid
  let canvas
  let hidden = true
  const generate =data=> {
    if (typeof(data) == 'string') data = data.toUpperCase()
    const opt = {
      errorCorrectionLevel: 'L',
      margin, scale,
      color: {
        dark: '#353535ff',
        light: '#ffffff00'
      },
    }
    if (mask) opt.maskPattern = mask
    if (ver) opt.version = ver
    QRCode.toCanvas(canvas, data, opt, display)
  }
  const display =e=> {
    console.log(`qr code generated: ${!e}`)
    hidden = !!e
    if (e) console.log(e)
  }
  $: size = (17 + (4 * ver)) * scale
  onMount(()=> generate(data))
  $: if (canvas) generate(data, scale, margin, ver, mask)
</script>

<div class="qrcode" style="width: {size}px; height: {size}px;">
  <div class="qrcanvas" class:hidden={hidden}>
    {#if uuid}
      <Link {uuid}><canvas bind:this={canvas}></canvas></Link>
    {:else}
      <canvas bind:this={canvas} {title}></canvas>
    {/if}
  </div>
  <div class="qrdefault" class:hidden={!hidden}>
    <Reticle size={1}>
      <span class="uitxt s1txt w5txt">ERR</span>
      {#if size > 65}
        <span class="uitxt s3txt">FAILED TO GENERATE QR CODE</span>
      {:else if size > 50}
        <span class="uitxt s3txt">QR CODE FAILED</span>
      {/if}
    </Reticle>
  </div>
</div>
