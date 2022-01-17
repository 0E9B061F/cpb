<script>
  import FB from './FB.svelte'
  import {getContext} from 'svelte'
  const space = getContext('space')
  const title = getContext('title')
</script>

<FB vert expand>
  <FB expand></FB>
  <div class="space">NAMESPACE: {$space}</div>
  <div class="title">{$title}</div>
</FB>

<style>
  .space {
    font-size: 1rem;
  }
  .title {
    font-size: 2rem;
    font-weight: bold;
  }
</style>

