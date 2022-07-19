<script>
  import Link from '../link/Link.svelte'
  import Obscured from './inlines/Obscured.svelte'
  import util from '../../lib/util.js'
  export let href
  export let title
  export let text
  export let raw
  $: email = href.startsWith('mailto:')
</script>

{#if email}
  <Obscured text={raw}/>
{:else}
  {raw}
{/if}
