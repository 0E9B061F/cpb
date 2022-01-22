<script>
	import FB from './FB.svelte'
	import Pipe from './Pipe.svelte'
	export let left
	export let right
	export let center
	export let expand = false
	export let vert = false
	let a = false
	let b = false
	let c = ''
	$: if (!left && !right && !center) center = true
	$: {
		c = []
		if (left) b = true
		else if (right) a = true
		else if (center) {
			a = true
			b = true
		}
		if (a) c.push('balance-left')
		if (b) c.push('balance-right')
		c = c.join(' ')
	}
</script>

<FB {expand} {vert} zero>
  {#if a}<Pipe expand {vert}/>{/if}
  <div class={c}><slot></slot></div>
  {#if b}<Pipe expand {vert}/>{/if}
</FB>
