<script>

  import Classed from './both/Classed.svelte'
  import Aside from './both/Aside.svelte'

  import Cite from './inlines/Cite.svelte'

  import Figure from './blocks/Figure.svelte'
  import Biblio from './blocks/Biblio.svelte'
  import Clear from './blocks/Clear.svelte'
  import Grid from './blocks/Grid.svelte'
  import Src from './blocks/Src.svelte'

  export let cmd
  export let cmdtype
  export let args
  export let block

  const bothcmds = {
    cls: Classed,
    aside: Aside,
  }
  const linecmds = {
    ...bothcmds,
    cite: Cite,
  }
  const blockcmds = {
    ...bothcmds,
    figure: Figure,
    biblio: Biblio,
    clear: Clear,
    grid: Grid,
    src: Src,
  }

  const getcmp =c=> {
    const r = block ? blockcmds[c] : linecmds[c]
    return r || null
  }

  console.log(cmd)

  $: cmp = getcmp(cmd)
</script>

{#if cmp}
  <svelte:component this={cmp} {args} {block}>
    <slot></slot>
  </svelte:component>
{:else}
  <slot></slot>
{/if}
