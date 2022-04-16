<script>
  import Link from '../link/Link.svelte'
  export let query
  export let text = null
  $: href = `https://www.biblegateway.com/passage/?search=${query}&version=KJV`
  $: display = text || query
</script>

<Link external={href} txtmark="B">{display}</Link>
