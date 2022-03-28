<script>
  import FB from '../FB.svelte'
  import Hexline from './Hexline.svelte'
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'

  export let state = 0b000000
  export let rand = false
  export let big = false
  export let order = 1
  export let type = null
  export let top = false
  export let dummy = false

  let hexn = writable(state)
  setContext('hexn', hexn)

  let timer
  let cls = ''

  $: $hexn = state
  const rint =(min, max)=> Math.random() * (max - min) + min
  const randomize =()=> state = rint(0b000000, 0b111111)
  const clrtimer =()=> {
    if (timer) clearTimeout(timer)
  }
  const mktimer =()=> {
    clrtimer()
    timer = setTimeout(loop, rand)
  }
  const loop =()=> {
    randomize()
    mktimer()
  }
  const mkc =()=> {
    const c = ['hexagram',`order-${order}`]
    if (big) c.push('hg-b1')
    if (top) c.push('hg-top')
    if (order > 1) c.push('ordered')
    cls = c.join(' ')
  }
  $: mkc(big)
  $: if (rand) mktimer()
  else clrtimer()
</script>

<FB c={cls} vert zero solid rel>
  {#if dummy}
  {:else if order == 3}
    <FB c="hg-outline" vert zero solid>
      <Hexline mask={0b000001}/>
      <Hexline mask={0b000010}/>
      <Hexline mask={0b000100}/>
      <Hexline mask={0b001000}/>
      <Hexline mask={0b010000}/>
      <Hexline mask={0b100000}/>
    </FB>
  {:else}
    <Hexline mask={0b000001}/>
    <Hexline mask={0b000010}/>
    <Hexline mask={0b000100}/>
    <Hexline mask={0b001000}/>
    <Hexline mask={0b010000}/>
    <Hexline mask={0b100000}/>
  {/if}
  {#if type}
    <FB abs center={order < 3} around={order > 2} c="hg-marker">
      {type}
    </FB>
  {/if}
</FB>
