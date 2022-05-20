<script>
  import FB from '../FB.svelte'
  import Link from '../link/Link.svelte'
  import TopButton from '../util/TopButton.svelte'

  import { getContext } from 'svelte'

  const loc = getContext('loc')
  const slugger = getContext('slugger')

  export let depth
  export let raw
  export let text

  $: id = slugger.slug(text)
  $: anchored = $loc.cmd == id
</script>

<FB tag="h{depth}" {id} c="cpb-heading" rel>
  <FB c="heading-pre system">
    {#if anchored}
      <span class="anchor-mark">
        <Link self decmd global silent>🖝</Link>
      </span>
    {:else}
      <FB expand vert center c="anchor-link hidable">
        <Link self cmd={id} global>LINK</Link>
      </FB>
    {/if}
  </FB>
  <span class="heading-text">
    <slot></slot>
  </span>
  <FB vert end c="heading-left hidable system">
    <FB line="s1">
      /
      <!--
      <Link nolink global>EDIT</Link>
      <Link nolink global>SOLO</Link>
      <Link nolink global>PARENT</Link>
      -->
      <TopButton/>
    </FB>
  </FB>
  <FB tag="span" expand/>
  <FB vert end c="heading-right hidable system">
  </FB>
</FB>
