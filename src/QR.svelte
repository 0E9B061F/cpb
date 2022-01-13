<script>
  import {getContext} from 'svelte'
  const gs = getContext('gs')
  import { onMount } from 'svelte'
  import QRCode from 'qrcode'
  export let data
  export let title
  export let href
  $: if (!data) data = href
  let canvas
  const generate =data=> {
    QRCode.toCanvas(canvas, data, {
      errorCorrectionLevel: 'L',
      margin: 1,
      scale: 3,
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

