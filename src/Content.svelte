<script>
  import Link from './Link.svelte'
  import History from './History.svelte'
  import QR from './QR.svelte'
  import PageForm from './PageForm.svelte'
  import Viewer from './Viewer.svelte'
  import SvelteMarkdown from 'svelte-markdown'
  import {getContext} from 'svelte'
  const gs = getContext('gs')
  const session = getContext('session')
  const path = getContext('path')
  const loc = getContext('loc')
  const space = getContext('space')
  const title = getContext('title')
  const renderers = { link: Link }
  $: rurl = $gs.rp($loc)
  $: cmd = $loc.cmd
  let error, noerror, page
  const request =u=> {
    return fetch(u)
    .then(res=> res.json())
    .then(res=> {
      error = res.error
      page = {
        namespace: res.namespace,
        title: res.title,
        body: res.body,
        uuid: res.uuid,
        vuuid: res.vuuid,
        parentVuuid: res.parentVuuid,
        childVuuid: res.childVuuid,
        vnum: res.vnum,
      }
      page.historical = !!page.childVuuid
      noerror = (error == 0 || error == undefined)
      if ($space != page.namespace) $space = page.namespace
      if ($title != page.title) $title = page.title
    })
  }
  const rereq =u=> {
    request(u).then(res=> {
      exitedit()
      exithistory()
    })
  }
  $: request(rurl)

  $: edit = cmd == 'edit'
  $: history = cmd == 'history'

  const enteredit =()=> edit = true
  const exitedit =()=> edit = false
  const enterhistory =()=> history = true
  const exithistory =()=> history = false
</script>

<p>RP: <a href={rurl}>{rurl}</a></p>
{#if page}<p>Title: {page.title}</p>{/if}

{#if noerror}
  {#if edit}
    <PageForm {page} editing={true} on:success={rereq(rurl)} on:cancel={exitedit}/>
  {:else if history}
    <History {page} />
  {:else}
    <Viewer {page} on:edit={enteredit} on:history={enterhistory}/>
  {/if}
{:else if error == 1}
  {#if $session.user.login}
    <PageForm {page} on:success={rereq(rurl)}/>
  {:else}
    <p>no page here. please log in to edit</p>
  {/if}
{:else}
  <p>ERROR {error}</p>
{/if}

