<script>
  import { onMount, createEventDispatcher } from 'svelte'

  export let t = 0
  export let end = 10000
  let invert = false
  let total = 0
  let fs = null
  let ft = 0
  const dispatch = createEventDispatcher()

  const frame =stamp=> {
    ft = fs ? stamp - fs : 0
    if (invert) total = Math.max(total - ft, 0)
    else total = Math.min(total + ft, end)
    t = total / end
    fs = stamp
    if ((invert && t > 0) || (!invert && t < 1)) requestAnimationFrame(frame)
    else complete()
  }
  const begin =()=> {
    if ((invert && t > 0) || (!invert && t < 1)) requestAnimationFrame(frame)
  }
  export const play =()=> {
    invert = false
    total = 0
    t = 0
    fs = null
    ft = 0
    begin()
  }
  export const reverse =()=> {
    invert = true
    total = end
    t = 1
    fs = null
    ft = 0
    begin()
  }

  const complete =()=> {
    console.log('COMPLETE')
    dispatch('complete')
  }

  onMount(()=> begin())

  $: pc = t * 100
</script>

<div class="loadbar">
  <div class="progress" style="width: {pc}%;"></div>
</div>
