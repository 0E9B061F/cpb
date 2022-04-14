<script>
  import FB from '../FB.svelte'
</script>

<FB vert c="info-module">
  {#if $$slots.title}
    <FB center line="s1" c="info-head blacktag">
      <slot name="title"></slot>
    </FB>
  {/if}
  {#if $$slots.body}
    <FB expand c="info-body">
      <slot name="body"></slot>
    </FB>
  {/if}
</FB>
