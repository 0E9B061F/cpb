<script>
  import FB from '../FB.svelte'
  import Link from '../Link.svelte'
  let h1
  let h2
  let h3
  let h4
</script>

<Link nst="foo" dbg>NST: 'foo'</Link>
<Link nst="main:bar" dbg>NST: 'main:bar'</Link>
<Link title="bar" dbg>TITLE ONLY: 'bar'</Link>
<Link space="xxx" dbg>SPACE ONLY: 'xxx'</Link>
