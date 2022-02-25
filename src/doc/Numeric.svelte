<script>
  import Text from './Text.svelte'
  import { getContext } from 'svelte'
  const setcontrols = getContext('setcontrols')
  let input
  export let val = 0
  export let min = 0
  export let max = 100
  export let w = 2
  export let lab = ''
  let user = val
  const controls =(m, e)=> {
		if (e.key == 'Enter') {
		  if (input) input.exit()
		}
	}
  const edited =e=> {
    user = e.detail.val
  }
  const focus =()=> {
    setcontrols(controls)
  }
  const blur =()=> {
    setcontrols()
    set()
  }
  const set =()=> {
    const u = parseInt(user) || 0
    if (u > max) val = max
    else if (u < min) val = min
    else val = u
    user = val
  }
  $: if (max <= min) max = min + 1
  $: if(val < min) val = min
  else if (val > max) val = max
</script>

<div class="numeric-input in{w}">
  <Text centertxt
    bind:this={input} value={user}
    on:edited={edited} on:focus={focus}
    on:blur={blur}
    {lab}
  />
</div>
