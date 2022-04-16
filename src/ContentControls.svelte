<script>
  import FB from './FB.svelte'
  import Link from './link/Link.svelte'
  import Separated from './util/Separated.svelte'
  import { getContext } from 'svelte'
  const haslogin = getContext('haslogin')

  class Control {
    constructor(name, label) {
      this.name = name
      this.label = label || name
    }
  }

  let controls = []
  const handlers = {
    bookmark: ()=> {},
    move: ()=> {},
    delete: ()=> {},
    duplicate: ()=> {},
  }

  const mkcontrols =()=> {
    const c = []
    if ($haslogin) {
      c.push(new Control('bookmark'))
      c.push(new Control('move'))
      c.push(new Control('delete'))
      c.push(new Control('duplicate'))
    }
    controls = c
  }

  $: mkcontrols($haslogin)
</script>

<FB c="content-controls" end>
  <Separated items={controls} line="s1" let:item={item}>
    <Link nolink does={handlers[item.name]}>{item.label}</Link>
  </Separated>
</FB>
