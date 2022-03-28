<script>
  import Link from './Link.svelte'
  import util from '../lib/util.js'
  export let nst
  export let text = null
  $: display = text || nst
</script>

<Link {nst}>{display}</Link>
