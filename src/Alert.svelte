<script>
  import FB from './FB.svelte'

  export let icon = 'NB'
  export let head
  export let message

  const mkicosize =()=> {
    if ($$slots.icon) return 's1'
    else if (icon.length < 3) return 'b3'
    else if (icon.length < 5) return 'b2'
    else if (icon.length < 7) return 'b1'
    else if (icon.length < 9) return 'n'
    else return 's1'
  }

  $: icosize = mkicosize(icon)
</script>

<FB rel c="alert system">

  <FB fw={9} line={icosize} tight end c="icon">
    {#if $$slots.icon}
      <slot name="icon"></slot>
    {:else}
      {icon}
    {/if}
  </FB>

  <FB vert center c="body" zero>
    {#if $$slots.body}
      <slot name="body"></slot>
    {:else}
      {#if $$slots.head || head}
        <FB vc line="s1" fw={7}>
          {#if $$slots.head}
            <slot name="head"></slot>
          {:else if head}
            {head}
          {/if}
        </FB>
      {/if}
      {#if $$slots.message}
        <FB vc line="s1"><slot name="message"></slot></FB>
      {:else if message}
        <FB vc line="s1">{message}</FB>
      {/if}
    {/if}
  </FB>

</FB>
