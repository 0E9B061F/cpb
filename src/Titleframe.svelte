<script>
	import FB from './FB.svelte'
	import QR from './QR.svelte'
	import TitleBar from './TitleBar.svelte'

  import { getContext } from 'svelte'
  const gs = getContext('gs')
  const page = getContext('page')
  const haspage = getContext('haspage')

  const crop =u=> u.match(/.*?\/\/(.*)/)[1]
	let perma, vperma, permac, vpermac
	$: if ($haspage) {
		perma = $gs.full($page.val.pageUuid)
		vperma = $gs.full($page.val.uuid)
		permac = crop(perma)
		vpermac = crop(vperma)
	}
</script>

<FB>
  <FB vert expand zero>
    <FB expand><TitleBar/></FB>
  </FB>
	{#if $haspage}<QR data={permac} href={perma} title="Page Permalink" />{/if}
	{#if $haspage}<QR data={vpermac} href={vperma} title="Version Permalink" />{/if}
</FB>
