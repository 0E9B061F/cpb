<script>
	import FB from './FB.svelte'
  export let left = false
  export let right = false
  export let center = false
  export let vert = false
  export let expand = false
  let a = false
  let b = false
  $: if (!left && !right && !center) center = true
  $: if (left) b = true
  else if (right) a = true
  else if (center) {
    a = true
    b = true
  }
  let pipe = !$$slots.default
</script>

<FB c="fb-pipe" {expand} vert={!vert} zero>
  {#if a}<FB c="fb-pipe-exp" expand leaf/>{/if}
  {#if pipe}
    {#if !vert}
      <div class="h-pipe"></div>
    {:else}
      <div class="v-pipe"></div>
    {/if}
  {:else}
    <slot></slot>
  {/if}
  {#if b}<FB c="fb-pipe-exp" expand leaf/>{/if}
</FB>
