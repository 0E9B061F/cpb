<script>
  import {getContext} from 'svelte'
  const gs = getContext('gs')
  import { onMount } from 'svelte'
  import QRCode from 'qrcode'
  export let data
  export let title
  export let href
  export let scale = 3
  $: if (!data) data = href
  let canvas
  const generate =data=> {
    data = data.toUpperCase()
    QRCode.toCanvas(canvas, data, {
      errorCorrectionLevel: 'L',
      margin: 1,
      scale,
      color: {
        dark: '#353535ff',
        light: '#ffffff00'
      },
    })
  }
  onMount(()=> generate(data))
  $: if (canvas) generate(data)
</script>

{#if href}
  <a {href} {title}><canvas bind:this={canvas}></canvas></a>
{:else}
  <canvas bind:this={canvas} {title}></canvas>
{/if}

