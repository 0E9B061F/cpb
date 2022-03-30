<script>
  import FB from './FB.svelte'
  import Loadbar from './Loadbar.svelte'
  import { onMount, createEventDispatcher } from 'svelte'

  export let end = 2500
  export let max = 6
  const dispatch = createEventDispatcher()
  let stack = [0]
  let reverse = false
  let mainbar

  const loop =()=> {
    if (!reverse && stack.length >= max) reverse = true
    else if (reverse && stack.length <= 1) reverse = false
    else {
      if (reverse) stack.pop()
      else stack.push(0)
    }
    stack = stack
    if (mainbar) {
      if (reverse) mainbar.reverse()
      else mainbar.play()
      dispatch('loop')
    }
  }

  $: head = stack[0]
  $: tail = stack.slice(1)
</script>

<FB vert>

{#each tail as t}
  <Loadbar t={1} {end}/>
{/each}

<Loadbar {end} on:complete={loop} bind:this={mainbar}/>

</FB>
