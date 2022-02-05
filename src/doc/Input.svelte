<script>
  import R2Over from '../r2/R2Over.svelte'
  import FB from '../FB.svelte'
  import { outclick } from "../../lib/outclick.js"
  import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()
  export let value = ''
  export let text = ''
  export let mini = false
  export let focused = false
  let input
  const onfocus =()=> {
    focused = true
    dispatch('focus')
  }
  const onblur =()=> {
    if (focused) input.focus()
  }
  export const exit =()=> {
    focused = false
    input.blur()
    dispatch('blur')
  }
</script>

<div class="input-wrapper" use:outclick on:outclick={exit}>
<R2Over size={0.4} fillv={true} c="flexinput {focused ? 'focused' : ''}">
  <svelte:fragment slot="inner">
  {#if text && !focused && !value}
    <FB vert center c="input-label">
      {text}
    </FB>
  {/if}
  </svelte:fragment>
  <input
    class="r2-input"
    bind:this={input} bind:value
    on:focus={onfocus} on:blur={onblur}
  />
  {#if focused && $$slots.extra}
    <FB leaf c="input-dropdown" slot="extra">
      <slot name="extra"></slot>
    </FB>
  {/if}
</R2Over>
</div>
