<script>
  import FB from '../FB.svelte'
  import { v4 } from 'uuid'
  const id = v4()
  export let lab = null
  export let flip = false
  export let state = false
  export let just = 'c'
</script>

<FB zero {flip} c="fd-input fd-check" {just}>
  {#if lab}
    <label for={id}>{lab}</label>
  {/if}
  <input {id} type="checkbox" class="doc-check" bind:checked={state}>
</FB>
