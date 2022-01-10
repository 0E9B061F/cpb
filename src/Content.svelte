<script>
  import Link from './Link.svelte'
  import History from './History.svelte'
  import QR from './QR.svelte'
  import PageForm from './PageForm.svelte'
  import Viewer from './Viewer.svelte'
  import SvelteMarkdown from 'svelte-markdown'
  import {getContext} from 'svelte'
  const gs = getContext('gs')
  const renderers = { link: Link }
  $: rurl = $gs.rp($gs.path)
  let error, noerror, page
  const request =u=> {
    fetch(u)
    .then(res=> res.json())
    .then(res=> {
      error = res.error
      page = {
        title: res.title,
        body: res.body,
        uuid: res.uuid,
        vuuid: res.vuuid,
        vnum: res.vnum,
      }
      noerror = (error == 0 || error == undefined)
      edit = false
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

<p>RP: {rurl}</p>
{#if page}<p>Title: {page.title}</p>{/if}

{#if noerror}
  {#if edit}
    <PageForm title={page.title} body={page.body} editing={true} on:success={request(rurl)} on:cancel={exitedit}/>
  {:else if history}
    <History {page} />
  {:else}
    <Viewer {page} on:edit={enteredit} on:history={enterhistory}/>
  {/if}
{:else if error == 1}
  <PageForm title={page.title} on:success={request(rurl)}/>
{:else}
  <p>ERROR {error}</p>
{/if}

