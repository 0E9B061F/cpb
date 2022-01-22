<script>
  import FB from './FB.svelte'
  export let lab = ''
  export let c = []
  if (typeof(c) == 'string') c = c.split(' ')
  c.push('fp-pair')
  $: block = $$slots.default
</script>

<FB {c}>
  <div class="fp-label">{lab}:</div>
  {#if block}<div class="fp-item"><slot></slot></div>{/if}
</FB>
