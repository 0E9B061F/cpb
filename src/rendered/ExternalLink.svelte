<script>
  import Link from '../link/Link.svelte'
  export let href
  export let text
</script>

<Link external={href} txtmark="X">{text}</Link>
