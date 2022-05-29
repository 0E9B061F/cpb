<script>
  import FB from '../FB.svelte'
  import Text from '../doc/Text.svelte'
  import Link from '../link/Link.svelte'
  import ControlModule from './ControlModule.svelte'
  import { getContext } from 'svelte'
  const dbg = getContext('dbg')

  const check =()=> {
    if (key && value == key) {
      dbg(`VALID. DELETING`)
    } else {
      dbg(`INCORRECT`)
    }
  }

  let value
</script>

<ControlModule name="move">
  <FB para="b1">Enter a new location:</FB>
  <FB line="b2">
    <FB line="b3">
      <Text/>
    </FB>
    <FB vc line="n">
      <Link nolink global>MOVE</Link>
    </FB>
  </FB>
</ControlModule>
