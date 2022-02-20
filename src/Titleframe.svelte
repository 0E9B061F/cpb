<script>
	import FB from './FB.svelte'
	import QR from './QR.svelte'

	import Doc from './doc/Doc.svelte'
	import Line from './doc/Line.svelte'
	import Lab from './doc/Lab.svelte'
	import Input from './doc/Input.svelte'

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

<FB c="title-frame">
	{#if $haspage}
		<QR data={vpermac} ver={3} scale={2} uuid={$page.val.uuid} title="Version Permalink" />
	  <Doc center w={false}>
			<Line s="s1">
				<Lab between txt="AUTHOR">{$page.val.user.handle}</Lab>
			</Line>
			<Line s="s1">
				<Lab between txt="VERSION">{$page.val.vnum}</Lab>
			</Line>
			<Line s="s1">
				<Lab between txt="VIEWS">{$page.val.views}</Lab>
			</Line>
	  </Doc>
		<FB expand/>
		<QR data={permac} ver={3} scale={2} uuid={$page.val.pageUuid} title="Page Permalink" />
	{/if}
</FB>
