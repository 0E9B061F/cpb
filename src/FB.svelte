<script>
  import { getContext } from 'svelte'
  export let c = []
  export let expand = false
  export let vert = false
  export let leaf = false
  export let grid = false
  if (typeof(c) == 'string') c = c.split(' ')
  if (expand) c.push('fb-expand')
  if (vert) c.push('fb-vert')
  if (!leaf) c.push('fb-box')
  if (grid) c.push('fb-grid')
  c = c.join(' ')
</script>

<div class="flexbox {c}">
  <slot></slot>
</div>

<style>
  .flexbox .flexbox {
    padding: 0.25rem;
  }
  .fb-box {
    display: flex;
  }
  .fb-expand {
    flex: 1;
  }
  .fb-vert {
    flex-direction: column;
  }
</style>

