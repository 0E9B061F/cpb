<script>
	import FB from './FB.svelte'
	import Link from './Link.svelte'
	import Input from './doc/Input.svelte'
  import { getContext } from 'svelte'
  const gs = getContext('gs')
  const path = getContext('path')
  const titlesearch = getContext('titlesearch')
  const modifiers = getContext('modifiers')
  const setcontrols = getContext('setcontrols')
  let exists = false
	let focused
	export let query = ''
	let result = []
	let timer = null
	let input

	const controls =(m, e)=> {
		if (e.key == 'Enter') {
			console.log('ENTER')
		} else if (e.key == 'Escape') {
			exit()
		}
	}
	const exit =()=> {
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

	$: if (result.length) {
		exists = false
		result.forEach(i=> {
			if (i.title == query) exists = true
		})
	}

	$: markcg = !!$modifiers.Shift
	$: marksearch = !$modifiers.Shift

	$: if (focused) {
		setcontrols(controls)
	} else {
		setcontrols()
	}
</script>

<FB vert zero c="search-bar r2-s4">
  <Input
		bind:this={input}
		bind:value={query}
		bind:focused={focused}
		text="SEARCH"
	>
		<svelte:fragment slot="extra">
		<FB between zero c="r2-row r2-top">
			<div class="r2-bar r2-hori"></div>
			<div class="r2-bar r2-hori"></div>
		</FB>
		<FB vert c="search-preview-wrapper">
			{#if result.length}
			<FB vert c="search-preview">
				{#each result as item}
					<FB leaf c="search-preview-item">
						<Link space={item.namespace} title={item.title}>{item.title}</Link>
					</FB>
				{/each}
			</FB>
			{/if}

			<FB around c="search-controls">
			  {#if exists}
			    <Link nolink>GO</Link>
			  {:else}
			    <Link nolink>CREATE</Link>
			  {/if}
				<Link nolink>SEARCH</Link>
			</FB>
		</FB>
	</svelte:fragment>
	</Input>
</FB>
