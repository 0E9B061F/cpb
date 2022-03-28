<script>
  import R2 from './R2.svelte'
  import FB from '../FB.svelte'
  export let size = 5
  export let fillv = false
  export let fillh = false
  export let hide = true
  export let hyper = true
</script>

{#if hide}
  <R2 {size} {fillh} {fillv} raise {hyper} abs>
    {#if $$slots.inner}<slot name="inner"></slot>{/if}
  </R2>
{/if}

{#if $$slots.hidable}
  <div class:invis={hide}>
    <slot name="hidable"></slot>
  </div>
{:else if $$slots.default}
  <slot></slot>
{/if}
