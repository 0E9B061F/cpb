<script>
  import { afterUpdate, getContext } from 'svelte'
  const finishload = getContext('finishload')
	export let cmp
  afterUpdate(()=> {
    if (cmp) {
      finishload()
    }
  })
</script>

{#if cmp}
  <svelte:component this={cmp}></svelte:component>
{/if}
