<script>
	import FB from './FB.svelte'
	import QR from './QR.svelte'
	import ContentControls from './ContentControls.svelte'
	import Tabulate from './util/Tabulate.svelte'

	import date from 'date-and-time'
  import { getContext } from 'svelte'
  const gs = getContext('gs')
  const page = getContext('page')
  const haspage = getContext('haspage')
  const pageinfo = getContext('pageinfo')

  const crop =u=> u.match(/.*?\/\/(.*)/)[1]
	let perma, vperma, permac, vpermac
	$: if ($haspage) {
		perma = $gs.full($page.val.pageUuid)
		vperma = $gs.full($page.val.uuid)
		permac = crop(perma)
		vpermac = crop(vperma)
	}
	const fmtdate =s=> {
		const d = new Date(s)
		return date.format(d, 'MM-DD-YYYY')
	}
	$: data = $haspage ? {
		author: $page.val.user.handle,
		version: $page.val.vnum,
		creator: $page.val.page.user.handle,
		words: $pageinfo.wc,
		time: $pageinfo.time,
		views: $page.val.views,
		created: fmtdate($page.val.page.createdAt),
		edited: fmtdate($page.val.createdAt),
		links: $pageinfo.links,
	} : {}
</script>

<FB vert c="title-frame">
	{#if $haspage}
		<ContentControls/>
		<FB>
			<QR data={vpermac} ver={3} scale={2} uuid={$page.val.uuid} title="Version Permalink" />
			<FB expand vert center>
		  	<Tabulate {data} line="s1"/>
			</FB>
			<QR data={permac} ver={3} scale={2} uuid={$page.val.pageUuid} title="Page Permalink" />
		</FB>
	{/if}
</FB>
