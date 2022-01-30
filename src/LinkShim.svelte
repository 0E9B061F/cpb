<script>
  import Link from './Link.svelte'
  export let href = ''
  export let title = undefined
  console.log(`HREF: ${href}`)
  if (href[0] == '/') href = href.slice(1)
  href = href.split('/')
  if (href.length < 2) href.unshift('main')
  let nst = href.join('/')
</script>

<Link {nst} {title}><slot></slot></Link>
