<script>
  import R2Over from '../r2/R2Over.svelte'
  import FB from '../FB.svelte'
  import { outclick } from "../../lib/outclick.js"
  import { createEventDispatcher } from 'svelte'
  import { v4 } from 'uuid'
  const id = v4()
	const dispatch = createEventDispatcher()
  export let value = ''
  export let text = ''
  export let focused = false
  export let center = false
  export let lab = ''
  export let flip = false
  export let useExtra = true
  let input
  const onfocus =()=> {
    focused = true
    dispatch('focus')
    if (input) input.select()
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
    erase()
    exit()
  }
  const edited =val=> {
    dispatch('edited', {val})
  }
  $: edited(value)
</script>

<div class="input-wrapper" use:outclick on:outclick={exit}>
<FB vert>
  <FB>
    <R2Over size={0.4} fillv={true} c="flexinput {focused ? 'focused' : ''}">
      <svelte:fragment slot="inner">
      {#if text && !focused && !value}
        <FB vert center c="input-label">
          {text}
        </FB>
      {/if}
      </svelte:fragment>
      <FB zero {flip} c="fd-input fd-text">
        {#if lab}
          <label for={id}>{lab}</label>
        {/if}
        <input {id} type="text" class="r2-input doc-text"
          class:centered-input={center}
          bind:this={input} bind:value={value}
          on:focus={onfocus} on:blur={onblur}
        />
      </FB>
      {#if focused && $$slots.extra && useExtra}
        <FB leaf c="input-dropdown" slot="extra">
          <slot name="extra"></slot>
        </FB>
      {/if}
    </R2Over>
    {#if $$slots.buttons}
      <slot name="buttons"></slot>
    {/if}
  </FB>
  {#if $$slots.options}
    <slot name="options"></slot>
  {/if}
</FB>
</div>
