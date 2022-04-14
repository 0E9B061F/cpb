<script>
  import FB from './FB.svelte'
  import { getContext } from 'svelte'
  const message = getContext('message')

  $: line = $message && $message.level == 'z' ? 's2' : 's1'
</script>

{#if $message.text}
  <FB vert center c="messenger">
    <FB {line} c="message level-{$message.level}">
      {$message.text}
    </FB>
  </FB>
{/if}
