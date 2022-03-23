<script>
  import FB from '../FB.svelte'

  export let c = []
  let ic = []

  const mkc =()=> {
    ic = ['wui-module', ...c]
  }

  $: mkc(c)
</script>

<FB vert c={ic}>

  <FB c="wui-head">
    {#if $$slots.title}
      <FB line="b2" fw={7} c="wui-title">
        <slot name="title"></slot>
      </FB>
    {/if}

    {#if $$slots.controls}
      <slot name="controls"></slot>
    {/if}
  </FB>

  {#if $$slots.body}
    <FB vert c="wui-body">
      <slot name="body"></slot>
    </FB>
  {/if}

</FB>
