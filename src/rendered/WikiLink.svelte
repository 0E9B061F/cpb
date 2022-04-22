<script>
  import Link from '../link/Link.svelte'
  export let title
  export let text = null

  const pclip = /^(:?[^:]+:)?(?<clip>.+) \(/
  const cclip = /^(:?[^:]+:)?(?<clip>[^.,]+)/
  const sclip = /^(:?[^:]+:)?(?<clip>\S+)/
  const clip =t=> {
    let m = t.match(pclip)
    if (m) return m.groups.clip
    m = t.match(cclip)
    if (m) return m.groups.clip
    m = t.match(sclip)
    if (m) return m.groups.clip
    return t
  }
  const mkdisp =d=> tricked ? clip(d) : d

  $: tricked = text === ''
  $: display = mkdisp(text || title, tricked)
  $: slug = title.replace(/ /g, '_')
  $: href = `https://en.wikipedia.org/wiki/${slug}`
</script>

<Link external={href} txtmark="W">{display}</Link>
