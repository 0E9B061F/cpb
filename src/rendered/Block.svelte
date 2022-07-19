<script>
  export let sig = null
  $: cls = sig ? sig.replace(/\./g, ' ').trim() : 'right'
</script>

<figure class={cls}>
  <slot></slot>
</figure>
