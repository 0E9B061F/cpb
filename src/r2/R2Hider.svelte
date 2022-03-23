<script>
  import R2 from './R2.svelte'
  import FB from '../FB.svelte'
  export let size = 5
  export let fillv = false
  export let fillh = false
  export let hide = true
</script>

{#if hide}
<R2 {size} {fillh} {fillv} raise abs/>
{/if}

<slot></slot>
