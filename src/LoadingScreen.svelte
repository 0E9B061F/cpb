<script>
  import FB from './FB.svelte'
  import Hexagram from './hex/Hexagram.svelte'
  import { rint } from '../lib/util.js'

  let s = []
  let timer
  let delay = 10
  const max = 300

  const t =()=> {
    const r = delay
    delay = Math.min(delay+10, max)
    return r >= max ? rint(100,1500) : r
  }
  const random =()=> rint(0b000000, 0b111111)
  const mkgc =()=> {
    const r1 = random()
    const r2 = random()
    const r3 = random()
    const r4 = random()
    const r5 = r1 ^ r2
    const r6 = r3 ^ r4
    const r7 = r5 ^ r6
    s = [r1,r2,r3,r4,r5,r6,r7]
  }
  const loop =()=> {
    mkgc()
    if (timer) clearTimeout(timer)
    setTimeout(loop, t())
  }
  loop()
</script>

<FB center expand c="loading-screen">

  <FB center expand><FB vert between>
    <FB center><Hexagram state={s[0]}/></FB>
    <Hexagram state={s[4]} order={2} type="δ"/>
    <FB center><Hexagram state={s[1]}/></FB>
  </FB></FB>

  <FB vert>
    <Hexagram dummy/>

    <FB expand vert>
      <FB line="b6" fw={9}>HOLD</FB>
      <FB vert zero c="blackbox">
        <FB c="blackcell head">
          <FB line="n" fw={8}>0x2764</FB>
          <FB vc expand c="blackfill blackline"/>
        </FB>
        <FB vert zero c="blackcell">
          <FB line="s3" fw={6} end>WELCOME TO THE</FB>
          <FB line="s3" fw={6} end>FUTURE</FB>
        </FB>
      </FB>
    </FB>

    <FB center>
      <Hexagram big top state={s[6]} order={3} type="𝚫"/>
    </FB>
  </FB>

  <FB center expand><FB vert between>
    <FB center><Hexagram state={s[2]}/></FB>
    <Hexagram state={s[5]} order={2} type="δ"/>
    <FB center><Hexagram state={s[3]}/></FB>
  </FB></FB>

</FB>
