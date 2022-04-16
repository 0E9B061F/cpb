<script>
  import Link from '../link/Link.svelte'
  export let title
  export let text = null
  $: slug = title.replace(/ /g, '_')
  $: href = `https://en.wikipedia.org/wiki/${slug}`
  $: display = text || title
</script>

<Link external={href} txtmark="W">{display}</Link>
