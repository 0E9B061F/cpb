<script>
  import FB from '../FB.svelte'
  import InfoTOC from './InfoTOC.svelte'
  import Tabulate from '../util/Tabulate.svelte'
  import HighlightControls from '../HighlightControls.svelte'
  import QR from '../QR.svelte'
  import { getContext } from 'svelte'
  import date from 'date-and-time'

  const gs = getContext('gs')
  const haspage = getContext('haspage')
  const page = getContext('page')
  const pageinfo = getContext('pageinfo')
  const state = getContext('state')
  const ui = getContext('ui')

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
    time: $pageinfo.time,
    words: $pageinfo.wc,
    links: $pageinfo.links,
    views: $page.val.views,
    version: $page.val.vnum,
    editor: {space: `~${$page.val.user.handle}`, label: $page.val.user.handle},
    creator: {space: `~${$page.val.page.user.handle}`, label: $page.val.page.user.handle},
    created: fmtdate($page.val.page.createdAt),
    edited: fmtdate($page.val.createdAt),
  } : {}
</script>

<FB c="infobar infotop system" vert>
  <FB center line="s1" c="blacktag">
    TYPE: <span class="blackval">
      {#if $state.head || $state.anchor}
        PAGE
      {:else}
        VERSION
      {/if}
    </span>
  </FB>

  {#if $state.pageperm || $state.verperm}
    <FB center line="s1" c="blacktag">
      PERMALINK
    </FB>
  {/if}

  <Tabulate {data} line="s1" rows={9} usew={10}/>


</FB>
<div class="content-start"></div>
<FB c="infobar system" vert>
  <FB c="qrcodes" around>
    <QR data={vpermac} ver={3} scale={2} uuid={$page.val.uuid} title="Version Permalink" />
    <QR data={permac} ver={3} scale={2} uuid={$page.val.pageUuid} title="Page Permalink" />
  </FB>
  <HighlightControls/>
  {#if $ui <= 1}
    <InfoTOC/>
  {/if}
</FB>
