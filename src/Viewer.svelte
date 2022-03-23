<script>
  import Link from './Link.svelte'
  import LinkShim from './LinkShim.svelte'
  import { convert } from 'html-to-text'
  import { getContext } from 'svelte'
  const rc = getContext('rc')
  const haspage = getContext('haspage')
  const page = getContext('page')
  const setTokens = getContext('setTokens')
  import SvelteMarkdown from 'svelte-markdown'

  const renderers = { link: LinkShim }
  let body
  let wc = 0
  let readTime = ''

  function onparse(e) {
    setTokens(e.detail.tokens)
    const txt = convert(body.innerHTML)
    wc = txt.trim().split(/\s+/).length
    const m = wc / $rc.readSpeed
    if (m < 2) readTime = 'a minute'
    else readTime =  `${Math.ceil(m)} minutes`
  }
  import { onMount } from 'svelte'
  onMount(()=> console.log('bar'))
</script>

{#if $haspage}
  <div class="rendered" bind:this={body}>
    <SvelteMarkdown source={$page.val.body} {renderers} on:parsed={onparse} />
  </div>
  <p>vnum: {$page.val.vnum}</p>
  <p>wc: {wc}</p>
  <p>read time: {readTime}</p>
{/if}
