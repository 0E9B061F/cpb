<script>
  import Link from '../link/Link.svelte'
  import util from '../../lib/util.js'
  export let href = ''
  export let title = undefined
  let nst = href
</script>

<Link {nst} {title}><slot></slot></Link>
