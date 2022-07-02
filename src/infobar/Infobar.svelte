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
		perma = $gs.full($page.val.resource.uuid)
		vperma = $gs.full($page.val.uuid)
		permac = crop(perma)
		vpermac = crop(vperma)
	}

  const fmtdate =s=> {
		const d = new Date(s)
		return date.format(d, 'MM-DD-YYYY')
	}

  const mkdata =()=> {
    const d = {}
    if ($haspage) {
      d.time = $pageinfo.time
      d.words = $pageinfo.wc
      d.links = $pageinfo.links
      d.views = $page.val.views
      d.version = $page.val.number
      d.editor = {space: `~${$page.val.editor}`, label: $page.val.editor}
      d.creator = {space: `~${$page.val.resource.creator}`, label: $page.val.resource.creator}
      d.created = fmtdate($page.val.resource.createdAt)
      d.edited = fmtdate($page.val.createdAt)
    }
    return d
  }

  const mkatom =()=> {
    const a = {}
    if ($haspage) {
      if ($page.val.resource.type == 'image') {
        a.width = $page.val.image.x
        a.height = $page.val.image.y
        a.size = $page.val.image.size
        a.mime = $page.val.image.mime
      }
    }
    return a
  }

  $: data = mkdata($page)
  $: atom = mkatom($page)
  $: datalen = Object.keys(data).length
  $: atomlen = Object.keys(atom).length
</script>

<FB c="infobar infotop system" vert>
  <FB center line="s1" c="blacktag">
    TYPE: <span class="blackval">{$page.val.resource.type.toUpperCase()}</span>
  </FB>

  {#if $state.pageperm || $state.verperm}
    <FB center line="s1" c="blacktag">
      PERMALINK
    </FB>
    {#if $state.verperm}
      <FB center line="s1" c="blacktag">
        {#if $state.old}
          OLD VERSION
        {:else}
          CURRENT VERS.
        {/if}
      </FB>
    {/if}
  {/if}
  <FB spacer={1}/>
  <Tabulate {data} line="s1" rows={datalen} usew={10}/>
  <FB spacer={1}/>
  {#if atomlen}
    <Tabulate data={atom} line="s1" rows={atomlen} usew={10}/>
    <FB spacer={1}/>
  {/if}
</FB>

<div class="content-start"></div>

<FB c="infobar system" vert>
  <FB c="qrcodes" around>
    <QR data={vpermac} ver={3} scale={2} uuid={$page.val.uuid} title="Version Permalink" />
    <QR data={permac} ver={3} scale={2} uuid={$page.val.resource.uuid} title="Page Permalink" />
  </FB>
  <HighlightControls/>
  {#if $ui <= 1}
    <InfoTOC/>
  {/if}
</FB>
