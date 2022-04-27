<script>
  import Link from '../link/Link.svelte'
  import { getContext } from 'svelte'
  const scrollinfo = getContext('scrollinfo')
  const scrolltop = getContext('scrolltop')
  const drophash = getContext('drophash')

  const gotop =()=> {
    drophash()
    scrolltop(false)
  }
</script>

<Link nolink does={gotop} disable={!$scrollinfo.scrolled}>TOP</Link>
