<script>
  import R2Over from '../r2/R2Over.svelte'
  import FB from '../FB.svelte'
  import { v4 } from 'uuid'
  const id = v4()
  import { createEventDispatcher, getContext, onDestroy } from 'svelte'
	const dispatch = createEventDispatcher()

  const addcontrols = getContext('addcontrols')
  const rmcontrols = getContext('rmcontrols')

  export let value = ''
  export let text = ''
  export let focused = false
  export let centertxt = false
  export let lab = ''
  export let flip = false
  export let center = true
  export let required = false
  export let autoselect = true
  export let grabfocus = false
  export let bluronenter = false

  export let type = "text"

  let input

  const onenter =()=> {
    dispatch('enter', {val: value})
    exit()
  }

  const controls =(m,e)=> {
    if (e.code == 'Enter') onenter()
    else if (e.code == 'Escape') exit()
  }

  const onfocus =()=> {
    addcontrols(controls)
    focus()
  }
  const onblur =()=> {
    rmcontrols(controls)
    exit()
  }
  const update =e=> {
    value = e.target.value
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
  export const focus =()=> {
    focused = true
    input.focus()
    if (autoselect && input) input.select()
    dispatch('focus')
  }
  const edited =val=> {
    dispatch('edited', {val})
  }

  onDestroy(()=> {
    rmcontrols(controls)
  })

  $: edited(value)
  $: if (input && grabfocus) focus()
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
    <input {id} {type} class="r2-input doc-text"
      {required}
      class:centered-input={centertxt}
      bind:this={input} {value}
      on:focus={onfocus} on:blur={onblur}
      on:input={update}
    />
  </R2Over>
</FB>
