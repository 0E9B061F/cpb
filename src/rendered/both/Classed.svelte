<script>
  import signature from '../../../lib/signature.js'
  export let args
  export let block

  $: cls = signature.consume(args, '*').values.join(' ')
</script>

{#if block}
  <div class={cls}><slot></slot></div>
{:else}
  <span class={cls}><slot></slot></span>
{/if}
