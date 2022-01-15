<script>
  import { getContext } from 'svelte'
  export let c = ''
</script>

<div class="flextab ${c}">
  <slot></slot>
</div>

<style>
  .flextab {
    display: flex;
  }
</style>

