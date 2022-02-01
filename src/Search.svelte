<script>
	import FB from './FB.svelte'
	import Link from './Link.svelte'
  import { getContext } from 'svelte'
  const gs = getContext('gs')
  const path = getContext('path')
  const titlesearch = getContext('titlesearch')
  const modifiers = getContext('modifiers')
  const setcontrols = getContext('setcontrols')
  let exists = false
	let focused = false
	export let query = ''
	let result = []
	let timer = null
	let input

	const controls =(m, e)=> {
		if (e.key == 'Enter') {
			console.log('ENTER')
		} else if (e.key == 'Escape') {
			blur()
		}
	}
	const focus =()=> {
		setcontrols(controls)
		focused = true
	}
	const blur =()=> {
		setcontrols()
		focused = false
		if (input) input.blur()
	}
	const search =()=> {
		if (!query || query == '') {
			result = []
			timer = null
		} else {
			titlesearch(query).then(res=> {
				if (res.err == 0) {
					result = res.val
					timer = null
				}
			})
		}
	}
	const delay =()=> {
    if (timer) clearTimeout(timer)
    timer = setTimeout(search, 500)
  }

	$: delay(query)

	$: markcg = !!$modifiers.Shift
	$: marksearch = !$modifiers.Shift
</script>

<FB form vert zero c="search-bar">

  <input type="text" class="search-input"
		bind:this={input}
		bind:value={query}
		on:focus={focus} on:blur={blur} />

	<FB vert c="search-dropdown" hide={!focused}>

		<FB vert c="search-preview">
			{#each result as item}
				<FB leaf c="search-preview-item">
					<Link space={item.namespace} title={item.title}>{item.title}</Link>
				</FB>
			{/each}
		</FB>

		<FB around c="search-controls">
		  {#if exists}
		    <Link nolink>GO</Link>
		  {:else}
		    <Link nolink>CREATE</Link>
		  {/if}
			<Link nolink>SEARCH</Link>
		</FB>

	</FB>
</FB>
