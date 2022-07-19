<script>
  import { getContext } from 'svelte'
  const msg = getContext('msg')
  export let copy
  export let block = false
  const docopy =()=> {
    navigator.clipboard.writeText(copy)
    msg('COPIED TO CLIPBOARD')
  }
  $: tag = block ? 'div' : 'span'
</script>

<svelte:element this={tag} class="click-copy" on:click={docopy}>
  <slot></slot>
</svelte:element>
