<script>
  import FB from './FB.svelte'
  import TitleControls from './TitleControls.svelte'
  import {getContext} from 'svelte'
  const space = getContext('space')
  const title = getContext('title')
</script>

<FB vert expand zero c="title">
  <FB>
    <div class="title-sub">NAMESPACE: {$space}</div>
    <FB expand></FB>
    <TitleControls/>
  </FB>
  <FB expand></FB>
  <div class="title-main">{$title}</div>
</FB>
