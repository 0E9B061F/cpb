<script>
  import Biblio from './blocks/Biblio.svelte'
  import Src from './blocks/Src.svelte'
  import Generic from './blocks/Generic.svelte'
  const commands = {
    biblio: Biblio,
    src: Src,
    generic: Generic,
  }
  export let call
  export let args = ''
  export let sig = null

  $: cmp = commands[call] || null
  $: arga = args.split(' ')
</script>

{#if cmp}
  <svelte:component this={cmp} args={arga}>
    <slot></slot>
  </svelte:component>
{/if}
