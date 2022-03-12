<script>
  import { getContext } from 'svelte'
  const message = getContext('message')
</script>

{#if $message.text}
  <div class="messenger">
    <span class="message level-{$message.level}">
      {$message.text}
    </span>
  </div>
{/if}
