<script>
  export let mark
  $: bi = mark.block
</script>

<div class="marker" class:thinmark={mark.type == 'thin'} style="top: {bi.y}px;">
  {#if mark.type == 'manicule'}
    🖝
  {/if}
</div>
