<script>
  import UUID from './UUID.svelte'
  import Balance from './Balance.svelte'
  import { isuu } from '../lib/util.js'
  export let left = false
  export let right = false
  export let uuid
  $: valid = isuu(uuid)
</script>

{#if valid}
  <UUID link={uuid}/>
{:else}
  <Balance {left} {right}><UUID>{uuid}</UUID></Balance>
{/if}
