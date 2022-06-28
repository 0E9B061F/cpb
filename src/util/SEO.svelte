<script>
  import { getContext } from 'svelte'

  const rc = getContext('rc')
  const doctitle = getContext('doctitle')
  const canonical = getContext('canonical')
  const iurl = getContext('iurl')
  const state = getContext('state')
  const haspage = getContext('haspage')
  const page = getContext('page')
  const space = getContext('space')
  const loc = getContext('loc')

  $: type = $state.content ? 'article' : 'website'
</script>

<meta name="description" content="" />

<link rel="canonical" href={$canonical} />

<meta property="og:title" content={$doctitle.short} />
<meta property="og:url" content={$canonical} />

<meta property="og:type" content={type} />

{#if type == 'article' && $haspage}
  <meta property="article:published_time" content={$page.val.resource.createdAt} />
  <meta property="article:modified_time" content={$page.val.createdAt} />
  <meta property="article:author" content={$page.val.editor} />
  {#if $loc.namespace || $space}
    <meta property="article:section" content={$loc.namespace || $space} />
    <meta property="article:tag" content={$loc.namespace || $space} />
  {/if}
{/if}
