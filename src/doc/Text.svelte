<script>
  import R2Over from '../r2/R2Over.svelte'
  import FB from '../FB.svelte'
  import { v4 } from 'uuid'
  const id = v4()
  import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()
  export let value = ''
  export let text = ''
  export let focused = false
  export let centertxt = false
  export let lab = ''
  export let flip = false
  export let center = true
  let input
  const onfocus =()=> {
    focused = true
    dispatch('focus')
    if (input) input.select()
  }
  const onblur =()=> {
    exit()
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

<FB zero {flip} c="fd-input fd-text" {center}>
  {#if lab}
    <label for={id}>{lab}</label>
  {/if}
  <R2Over size="x" fillv={true} c="flexinput {focused ? 'focused' : ''}">
    <svelte:fragment slot="inner">
    {#if text && !focused && !value}
      <FB vert center c="input-label">
        {text}
      </FB>
    {/if}
    </svelte:fragment>
      <input {id} type="text" class="r2-input doc-text"
        class:centered-input={centertxt}
        bind:this={input} bind:value={value}
        on:focus={onfocus} on:blur={onblur}
      />
  </R2Over>
</FB>
