<script>
  import Link from './Link.svelte'
  import Reticle from './Reticle.svelte'
  import { getContext } from 'svelte'
  const gs = getContext('gs')
  import { onMount } from 'svelte'
  import QRCode from 'qrcode'
  export let data
  export let title
  export let href
  export let scale = 3
  export let margin = 0
  export let ver = 1
  $: if (!data) data = href
  let canvas
  let hidden = true
  const generate =data=> {
    data = data.toUpperCase()
    QRCode.toCanvas(canvas, data, {
      errorCorrectionLevel: 'L',
      margin, scale, version: ver,
      color: {
        dark: '#353535ff',
        light: '#ffffff00'
      },
    }, display)
  }
  const display =e=> {
    console.log(`qr code generated: ${!e}`)
    hidden = !!e
    if (e) console.log(e)
  }
  $: size = (17 + (4 * ver)) * scale
  onMount(()=> generate(data))
  $: if (canvas) generate(data)
</script>

<div class="qrcode" style="width: {size}px; height: {size}px;">
  <div class="qrcanvas" class:hidden={hidden}>
    {#if href}
      <Link {href} {title}><canvas bind:this={canvas}></canvas></Link>
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
