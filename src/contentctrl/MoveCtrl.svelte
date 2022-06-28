<script>
  import FB from '../FB.svelte'
  import Text from '../doc/Text.svelte'
  import Link from '../link/Link.svelte'
  import ControlModule from './ControlModule.svelte'
  import { getContext } from 'svelte'

  const dbg = getContext('dbg')
  const exists = getContext('exists')
  const move = getContext('move')

  let timer

  const attempt =async()=> {
    if (timer) clearTimeout(timer)
    const res = await move(value)
    valid = res.err == 0
    return valid
  }
  const update =()=> {
    if (timer) clearTimeout(timer)
    timer = setTimeout(check, 500)
  }
  const check =async()=> {
    const e = await exists(value)
    valid = !e
  }

  let value
  let valid = false
</script>

<ControlModule name="move">
  <FB para="b1">Enter a new location:</FB>
  <FB line="b2">
    <FB line="b3">
      <Text bind:value={value} on:enter={attempt} on:edited={update}/>
    </FB>
    <FB vc line="n">
      <Link global cond={attempt} nst={value}>MOVE</Link>
    </FB>
  </FB>
</ControlModule>
