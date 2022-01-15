<script>
  import {getContext} from 'svelte'
  const gs = getContext('gs')
  const loc = getContext('loc')
  const session = getContext('session')
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

{#if $session.user.login && !page.historical}
  <Link self cmd="edit">EDIT</Link>
{/if}
<Link self cmd="history">HISTORY</Link>
{#if page.historical}
  <Link uuid={page.uuid}>HEAD</Link>
{/if}
{#if $loc.uuid && !page.historical}
  <Link space={page.namespace} title={page.title}>ANCHOR</Link>
{/if}
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

