<script>
  import { getContext } from 'svelte'
  const message = getContext('message')
</script>

<div class="messenger">
<span class="message level-{$message.level}">
{$message.text}
</span>
</div>

<style>
.level-0 {
}
.level-1 {
  background-color: yellow;
}
.level-2 {
  background-color: red;
}
</style>

