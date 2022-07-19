<script>
  import signature from '../../../lib/signature.js'
  export let args
  export let block

  $: sig = signature.consume(args, '*')
  $: msg = sig.values.join(' ')
</script>

{#if block}
  <div class="aside" title={msg}><slot></slot></div>
{:else}
  <span class="aside inline" title={msg}><slot></slot></span>
{/if}
