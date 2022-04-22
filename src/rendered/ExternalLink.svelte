<script>
  import Link from '../link/Link.svelte'
  export let href
  export let text = null
  const clip = /^[^.\/]+/
  const proto = /^[a-zA-Z][a-zA-Z0-9+.\-]*:\/\//
  const mkhref =h=> {
    const match = h.match(proto)
    return match ? h : `https://${h}`
  }
  const mkdisp =d=> {
    if (tricked) {
      let url
      try {
        url = new URL(external)
      } catch (TypeError) {
        return d
      }
      if (!url.hostname) return d
      else {
        const match = url.hostname.match(/^(?:www\.)?(?<txt>[^.]+)/)
        if (match && match.groups.txt) {
          return match.groups.txt
        } else {
          return d
        }
      }
    } else {
      return d
    }
  }
  $: tricked = text === ''
  $: external = mkhref(href)
  $: display = mkdisp(text || href, tricked)
</script>

<Link {external} txtmark="X">{display}</Link>
