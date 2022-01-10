<script>
  import Link from './Link.svelte'
  import QR from './QR.svelte'
  import SvelteMarkdown from 'svelte-markdown'
  import { createEventDispatcher } from 'svelte'
  
  const renderers = { link: Link }
	const dispatch = createEventDispatcher()
  const edit =()=> dispatch('edit')
  const history =()=> dispatch('history')
  const fakeurl =uuid=> `hex.atronics.org/u/${uuid}`

  export let page
</script>

<button on:click|preventDefault={edit}>EDIT</button>
<button on:click|preventDefault={history}>HISTORY</button>
<br/>
<QR data={fakeurl(page.uuid)} title="Page Permalink" />
<QR data={fakeurl(page.vuuid)} title="Version Permalink" />
<SvelteMarkdown source={page.body} {renderers} />
<p class="uuid">UUID: {page.uuid}</p>
<p class="uuid">VUUID: {page.vuuid}</p>
<p>vnum: {page.vnum}</p>

<style>
  .uuid {
    font-variant: all-small-caps slashed-zero;
    font-family: monospace;
  }
</style>

