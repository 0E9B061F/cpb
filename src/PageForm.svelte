<script>
  import Link from './Link.svelte'
  import FB from './FB.svelte'

  import { getContext } from 'svelte'
  const page = getContext('page')
  const updatepage = getContext('updatepage')
  const postpage = getContext('postpage')
  const loc = getContext('loc')

  export let editing = false
  let namespace = $page.val ? $page.val.namespace : $loc.namespace
  let title = $page.val ? $page.val.title : $loc.title
  let body = $page.val ? $page.val.body : ''

  const save =()=> {
    const data = {namespace, title, body}
    return editing ? updatepage(data) : postpage(data)
  }
</script>

<FB vert form>
  <textarea class="main-editor" bind:value={body}></textarea>
  <FB flip>
    {#if editing}
      <Link decmd first={save}>SAVE</Link>
      <Link decmd>CANCEL</Link>
    {:else}
      <Link self global first={save}>SAVE</Link>
    {/if}
  </FB>
</FB>

<style>
  .main-editor {
    height: 60vh;
  }
</style>
