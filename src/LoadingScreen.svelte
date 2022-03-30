<script>
  import FB from './FB.svelte'
  import Hexagram from './hex/Hexagram.svelte'
  import Loadbar from './Loadbar.svelte'
  import Loadstack from './Loadstack.svelte'
  import { rint } from '../lib/util.js'
  import Oracle from '../lib/yarrow.js'
  import { onMount } from 'svelte'

  let s = []
  const oracle = new Oracle()

  const fuzz =n=> n + rint(-10, 10)
  const t =()=> {
    const r = delay
    delay = Math.min(delay+30, max)
    return fuzz(r >= max ? max : r)
  }
  const random =()=> rint(0b000000, 0b111111)
  const prognosticate =()=> {
    const r1 = oracle.query('foo')
    const r2 = oracle.query('bar')

    const h1 = r1.hexagram
    const h2 = r1.zhigua
    const h3 = r2.hexagram
    const h4 = r2.zhigua
    const h5 = r1.change
    const h6 = r2.change
    const h7 = h2 ^ h4
    s = [h1,h2,h3,h4,h5,h6,h7]
  }

  onMount(()=> prognosticate())
</script>

<FB center expand c="loading-screen">

  <FB center expand><FB vert between>
    <FB center><Hexagram state={s[0]}/></FB>
    <FB center><Hexagram state={s[4]}/></FB>
    <FB center><Hexagram state={s[1] || 0} nohex={s[1] === null} top type="之卦" order={2}/></FB>
  </FB></FB>

  <FB vert>
    <Hexagram dummy/>

    <FB expand vert>
      <FB title line="b6" fw={9}>HOLD</FB>
      <FB vert zero c="blackbox">
        <FB c="blackcell head">
          <FB title mono line="n">0x2764</FB>
          <FB vc expand c="blackfill blackline"/>
        </FB>
        <FB vert zero c="blackcell">
          <FB line="s3" fw={6} end>WELCOME TO THE</FB>
          <FB line="s3" fw={6} end>FUTURE</FB>
        </FB>
      </FB>
      <Loadstack end={2500} max={6} on:loop={prognosticate}/>
    </FB>

    <FB center>
      <Hexagram big top state={s[6]} order={3} type="之卦"/>
    </FB>
  </FB>

  <FB center expand><FB vert between>
    <FB center><Hexagram state={s[2]}/></FB>
    <FB center><Hexagram state={s[5]}/></FB>
    <FB center><Hexagram state={s[3] || 0} nohex={s[3] === null} top type="之卦" order={2}/></FB>
  </FB></FB>

</FB>
