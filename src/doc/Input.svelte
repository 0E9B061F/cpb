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
  export const erase =()=> {
    value = ''
  }
  export const quit =()=> {
    exit()
    erase()
  }
  const edited =val=> {
    dispatch('edited', {val})
  }
  $: edited(value)
</script>

<div class="input-wrapper" use:outclick on:outclick={exit}>
<FB>
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
    bind:this={input} bind:value={value}
    on:focus={onfocus} on:blur={onblur}
  />
  {#if focused && $$slots.extra}
    <FB leaf c="input-dropdown" slot="extra">
      <slot name="extra"></slot>
    </FB>
  {/if}
</R2Over>
{#if $$slots.buttons}
  <slot name="buttons"></slot>
{/if}
</FB>
</div>
