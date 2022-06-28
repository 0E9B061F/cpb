<script>
  import FB from '../FB.svelte'
  import Text from '../doc/Text.svelte'
  import Link from '../link/Link.svelte'
  import ControlModule from './ControlModule.svelte'
  import { getContext } from 'svelte'
  const haspage = getContext('haspage')
  const page = getContext('page')
  const dbg = getContext('dbg')
  const trash = getContext('trash')

  const check =async()=> {
    if (key && value == key) {
      dbg(`VALID. DELETING`)
      const res = await trash()
      return res.err == 0
    } else {
      return false
    }
  }

  let value
  $: key = $haspage ? $page.val.resource.uuid.match(/[^-]+/)[0].toUpperCase() : null
  $: precheck = key && value == key
</script>

<ControlModule name="delete">
  {#if key}
    <FB>
      <FB end para="b2" fw={5}>ARE YOU SURE?</FB>
      <FB vert center>
        <FB end para="n">Enter '{key}' to confirm deletion:</FB>
      </FB>
    </FB>
    <FB end>
      <FB end line="b3">
        <Text bind:value={value} on:enter={check}/>
      </FB>
      <FB vert center>
        <FB end line="n">
          <Link disable={!precheck} global cond={check}>DELETE</Link>
        </FB>
      </FB>
    </FB>
  {:else}
    <FB>Error: page is not loaded.</FB>
  {/if}
</ControlModule>
