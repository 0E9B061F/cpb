<script>
  import Link from './Link.svelte'
  import History from './History.svelte'
  import QR from './QR.svelte'
  import PageForm from './PageForm.svelte'
  import Viewer from './Viewer.svelte'
  import SvelteMarkdown from 'svelte-markdown'
  import {getContext} from 'svelte'
  const gs = getContext('gs')
  const path = getContext('path')
  const loc = getContext('loc')
  const renderers = { link: Link }
  $: rurl = $gs.rp($loc)
  let error, noerror, page
  const request =u=> {
    fetch(u)
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
      exitedit()
      exithistory()
    })
  }
  $: request(rurl)

  $: edit = false
  $: history = false

  const enteredit =()=> edit = true
  const exitedit =()=> edit = false
  const enterhistory =()=> history = true
  const exithistory =()=> history = false
</script>

<p>RP: <a href={rurl}>{rurl}</a></p>
{#if page}<p>Title: {page.title}</p>{/if}

{#if noerror}
  {#if edit}
    <PageForm {page} editing={true} on:success={request(rurl)} on:cancel={exitedit}/>
  {:else if history}
    <History {page} />
  {:else}
    <Viewer {page} on:edit={enteredit} on:history={enterhistory}/>
  {/if}
{:else if error == 1}
  <PageForm {page} on:success={request(rurl)}/>
{:else}
  <p>ERROR {error}</p>
{/if}

