<script>
  import Link from './Link.svelte'
  import PageForm from './PageForm.svelte'
  import SvelteMarkdown from 'svelte-markdown'
  import {getContext} from 'svelte'
  const gs = getContext('gs')
  const renderers = { link: Link }
  $: rurl = $gs.rp($gs.path)
  let error, title, body, noerror
  const request =u=> {
    fetch(u)
    .then(res=> res.json())
    .then(res=> {
      error = res.error
      title = res.title
      body = res.body
      noerror = (error == 0 || error == undefined)
    })
  }
  $: request(rurl)
</script>

<p>RP: {rurl}</p>
<p>Title: {title}</p>

{#if noerror}
  <SvelteMarkdown source={body} {renderers} />
{:else if error == 1}
  <PageForm {title} on:success={request(rurl)}/>
{:else}
  <p>ERROR {error}</p>
{/if}

<style>
</style>

