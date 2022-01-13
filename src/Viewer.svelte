<script>
  import {getContext} from 'svelte'
  const gs = getContext('gs')
  import Link from './Link.svelte'
  import QR from './QR.svelte'
  import SvelteMarkdown from 'svelte-markdown'
  import { createEventDispatcher } from 'svelte'
  
  const renderers = { link: Link }
	const dispatch = createEventDispatcher()
  const edit =()=> dispatch('edit')
  const history =()=> dispatch('history')
  const fakeurl =uuid=> $gs.full(uuid)

  const crop =u=> u.match(/.*?\/\/(.*)/)[1]

  export let page
  $: perma = fakeurl(page.uuid)
  $: vperma = fakeurl(page.vuuid)
  $: permac = crop(perma)
  $: vpermac = crop(vperma)
</script>

{#if !page.historical}<button on:click|preventDefault={edit}>EDIT</button>{/if}
<button on:click|preventDefault={history}>HISTORY</button>
<br/>
<QR data={`http://${permac}`} href={perma} title="Page Permalink" />
<QR data={vpermac} href={vperma} title="Version Permalink" />
<SvelteMarkdown source={page.body} {renderers} />
<p class="uuid">UUID: {page.uuid}</p>
<p class="uuid">VUUID: {page.vuuid}</p>
<p class="uuid">parent VUUID: {page.parentVuuid}</p>
<p class="uuid">child VUUID: {page.childVuuid}</p>
<p>vnum: {page.vnum}</p>

<style>
  .uuid {
    font-family: monospace;
  }
</style>

