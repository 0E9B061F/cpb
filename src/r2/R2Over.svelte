<script>
  import R2 from './R2.svelte'
  import FB from '../FB.svelte'
  export let size = 5
  export let fillv = false
  export let fillh = false
  export let c = ''
  $: if (Array.isArray(c)) c.join(' ')
</script>

<FB leaf expand c="{c} r2-over">
  <div class="r2-wrapper">
    <R2 {size} {fillh} {fillv} />
    {#if $$slots.inner}
      <div class="r2-over-inner">
        <slot name="inner"></slot>
      </div>
    {/if}
    <div class="r2-inside">
      <slot></slot>
    </div>
    {#if $$slots.extra}
      <slot name="extra"></slot>
    {/if}
  </div>
</FB>
