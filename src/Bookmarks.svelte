<script>
	import Link from './Link.svelte'
	import FB from './FB.svelte'
</script>

<FB flip>
<Link nst="main">HOME</Link>
<Link nst="main/foo">foo</Link>
<Link nst="main/bar">bar</Link>
<Link nst="main/Home">HOME 2</Link>
<Link nst="main/FAKE">RED LINK</Link>
</FB>
