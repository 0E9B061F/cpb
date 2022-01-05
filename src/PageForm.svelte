<script>
  import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
  import {getContext} from 'svelte'
  const gs = getContext('gs')
  $: rurl = $gs.rp($gs.path)
  let body = ""
  export let title
  const postpage = async ()=> {
    await fetch(rurl, {
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
        $gs.aod = Date.now()
      }
    })
  }
</script>

<form>
  <textarea bind:value={body}></textarea>
  <button on:click|preventDefault={postpage}>SAVE</button>
</form>

<p>T: {title}</p>
<p>B: {body}</p>

<style>
</style>
