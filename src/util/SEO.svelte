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
  const ver = __CPB_REMAINDER ? `${__CPB_VERSION}.${__CPB_RELEASE}` : __CPB_VERSION
</script>

<meta name="robots" content="index, follow">
<meta name="generator" content="{__CPB_NAME} {ver} '{__CPB_SERIES}'">
<meta name="application-name" content={$rc.title}>

<meta name="description" content="" />

<link rel="canonical" href={$canonical} />

<meta property="og:site_name" content={$rc.title} />
<meta property="og:title" content={$doctitle.short} />
<meta property="og:url" content={$canonical} />

<meta property="og:image" content={iurl('og-default.png')} />
<meta property="og:image:alt" content="A logo featuring a pixelated heart and '0x2764' typeset in a bold monospace font." />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />

<meta property="og:type" content={type} />

{#if type == 'article' && $haspage}
  <meta property="article:published_time" content={$page.val.page.createdAt} />
  <meta property="article:modified_time" content={$page.val.createdAt} />
  <meta property="article:author" content={$page.val.user.handle} />
  {#if $loc.namespace || $space}
    <meta property="article:section" content={$loc.namespace || $space} />
    <meta property="article:tag" content={$loc.namespace || $space} />
  {/if}
{/if}
