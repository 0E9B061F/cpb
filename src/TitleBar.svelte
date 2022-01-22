<script>
  import FB from './FB.svelte'
  import {getContext} from 'svelte'
  const space = getContext('space')
  const title = getContext('title')
</script>

<FB vert expand zero c="title">
  <FB expand></FB>
  <div class="title-sub">NAMESPACE: {$space}</div>
  <div class="title-main">{$title}</div>
</FB>
