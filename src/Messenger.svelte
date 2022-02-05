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

<style>
  .message {
    padding-left: 0.3125rem;
    padding-right: 0.3125rem;
    font-weight: 500;
    border: 1px solid #353535;
  }
  .level-0 {
    background-color: #d6ecef;
    border: 1px solid #90b8c1;
  }
  .level-1 {
    background-color: yellow;
  }
  .level-2 {
    background-color: red;
  }
</style>
