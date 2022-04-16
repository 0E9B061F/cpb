<script>
  import Link from '../link/Link.svelte'
  export let href
  export let text = null
  $: display = text || href
</script>

<Link external={href} txtmark="X">{display}</Link>
