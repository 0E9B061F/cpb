<script>
  import Link from '../../link/Link.svelte'
  export let args = []
  $: ident = args[0]
  $: detail = args.slice(1)
</script>

<span class="citation">
  <span class="citation-text">
    <slot></slot>
  </span>
  <Link self cmd={ident}/>
</span>
