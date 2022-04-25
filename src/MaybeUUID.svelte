<script>
  import UUID from './UUID.svelte'
  import Strike from './util/Strike.svelte'
  import { isuu } from '../lib/util.js'
  export let left = false
  export let right = false
  export let uuid
  $: valid = isuu(uuid)
</script>

{#if valid}
  <UUID link={uuid}/>
{:else}
  {#if right}<Strike/>{/if}
  <UUID>{uuid}</UUID>
  {#if left}<Strike/>{/if}
{/if}
