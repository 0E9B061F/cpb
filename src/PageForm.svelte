<script>
  import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
  import {getContext} from 'svelte'
  const gs = getContext('gs')
  $: rurl = $gs.rp($gs.path)
  export let body = ""
  export let title
  export let editing = false
  const update = $gs.cmd('update', '/'+title)
  const postpage = async ()=> {
    const url = editing ? update : rurl
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({title, body}),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(res=> res.json())
    .then(res=> {
      if (!res.error || res.error == 0) {
        dispatch('success')
        if (!editing) $gs.aod = Date.now()
      }
    })
  }
  const canceledit =()=> {
    dispatch('cancel')
  }
</script>

<form>
  <textarea bind:value={body}></textarea>
  <button on:click|preventDefault={postpage}>SAVE</button>
  {#if editing}<button on:click|preventDefault={canceledit}>CANCEL</button>{/if}
</form>

<p>T: {title}</p>
<p>B: {body}</p>

<style>
</style>
