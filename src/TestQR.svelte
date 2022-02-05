<script>
  import FB from './FB.svelte'
  import QR from './QR.svelte'
  import Link from './Link.svelte'
  import Doc from './doc/Doc.svelte'
  import Line from './doc/Line.svelte'
  import Lab from './doc/Lab.svelte'
  import Input from './doc/Input.svelte'
  import Reticle from './Reticle.svelte'
  import { v4 } from 'uuid'
  function rand(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  const rint =()=> {
    const nums = [...Array(41).keys()]
    return [{
      data: nums.map(x=> rand(0,9)).join(''),
      mode: 'numeric',
    }]
  }
  let rn = rint()
  const rern =()=> rn = rint()
  const n41 = [{
    data: '00000000000000000000000000000000000000000',
    mode: 'numeric',
  }]
  const n41b = [{
    data: '99999999999999999999999999999999999999999',
    mode: 'numeric',
  }]
  const v1b0 = [{
    data: [],
    mode: 'byte',
  }]
  const masks = [...Array(8).keys()]
  class Uset {
    constructor(mask) {
      this.mask = mask
      this.generate()
    }
    generate() {
      this.uuids = masks.map(x=> v4())
    }
  }
  const sets = masks.map(x=> new Uset(x))
  const regen =()=> {
    console.log('regenning')
    sets.forEach(s=> s.generate())
    return new Promise(res=> res(sets))
  }
  let sbtxt = 'what are the roots clutch'
  let inver = 1
  let inmask = 0
  let inscale = 4
  let sbver = inver
  let sbmask = inmask
  let sbscale = inscale
  $: if (inver) sbver = Math.min(Math.max(inver, 1), 40)
  $: if (inmask) sbmask = Math.min(Math.max(inmask, 0), 7)
  $: if (inscale) sbscale = Math.min(Math.max(inscale, 1), 8)
</script>

<FB vert c="qr-tests">

  <FB>
    <FB center vert w={50}>
      <FB center>
        <QR ver={sbver} scale={sbscale} mask={sbmask} data={sbtxt}/>
      </FB>
    </FB>

    <Doc w={50}>
      <Line s='b1' input>
        <Lab txt="DATA"><Input bind:value={sbtxt}/></Lab>
      </Line>
      <Line s='s1' input>
        <Lab w={30} txt="VER"><Input bind:value={inver}/></Lab>
        <Lab w={30} txt="MASK"><Input bind:value={inmask}/></Lab>
        <Lab w={30} txt="SCALE"><Input bind:value={inscale}/></Lab>
      </Line>
    </Doc>

  </FB>

  <FB between c="qr-bay">
    <FB center vert c="qrt63"/>
    {#each masks as mask}
      <FB center vert c="qrt63"><span>m{mask}</span></FB>
    {/each}
  </FB>

  <FB between c="qr-bay">
    <FB center vert c="qrblab"><span>0s</span></FB>
    {#each masks as mask}
      <QR ver={1} scale={3} {mask} data={n41}/>
    {/each}
  </FB>

  <FB between c="qr-bay">
    <FB center vert c="qrblab"><span>9s</span></FB>
    {#each masks as mask}
      <QR ver={1} scale={3} {mask} data={n41b}/>
    {/each}
  </FB>

  <FB between c="qr-bay">
    <FB center vert c="qrblab">
      <span>rand</span>
      <Link global nolink first={rern}>GEN</Link>
    </FB>
    {#each masks as mask}
      <QR ver={1} scale={3} {mask} data={rn}/>
    {/each}
  </FB>

  <FB between c="qr-bay">
    <FB center vert c="qrblab"><span>bin 0</span></FB>
    {#each masks as mask}
      <QR ver={1} scale={3} {mask} data={v1b0}/>
    {/each}
  </FB>

  <FB>
    <h3>UUIDs</h3>
    <FB vert flip>
      <Link nolink global first={regen}>REGEN</Link>
    </FB>
  </FB>
  {#each sets as set}
    <FB between c="qr-bay">
      <FB center vert c="qrblab"><span>m{set.mask}</span></FB>
      {#each set.uuids as uuid}
        <QR ver={2} scale={3} mask={set.mask} data={uuid}/>
      {/each}
    </FB>
  {/each}

</FB>
