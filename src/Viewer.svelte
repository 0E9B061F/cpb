<script>
  import Link from './Link.svelte'
  import LinkShim from './LinkShim.svelte'
  import { getContext } from 'svelte'
  const page = getContext('page')
  import SvelteMarkdown from 'svelte-markdown'

  const renderers = { link: LinkShim }
</script>

{#if $page.val}
  <div class="rendered">
    <SvelteMarkdown source={$page.val.body} {renderers} />
  </div>
  <p>vnum: {$page.val.vnum}</p>
{/if}
