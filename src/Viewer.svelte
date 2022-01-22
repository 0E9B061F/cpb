<script>
  import Link from './Link.svelte'
  import { getContext } from 'svelte'
  const page = getContext('page')
  import SvelteMarkdown from 'svelte-markdown'

  const renderers = { link: Link }
</script>

{#if $page.val}
  <SvelteMarkdown source={$page.val.body} {renderers} />
  <p>vnum: {$page.val.vnum}</p>
{/if}
