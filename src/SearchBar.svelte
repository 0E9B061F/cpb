<script>
	import FB from './FB.svelte'
	import Doc from './doc/Doc.svelte'
	import Line from './doc/Line.svelte'
	import Lab from './doc/Lab.svelte'
	import Link from './Link.svelte'
	import Input from './doc/Input.svelte'
	import Check from './doc/Check.svelte'
	import Numeric from './doc/Numeric.svelte'
	import SearchEmph from './SearchEmph.svelte'

  import { getContext } from 'svelte'
  const gs = getContext('gs')
  const path = getContext('path')
  const loc = getContext('loc')
  const fullsearch = getContext('fullsearch')
  const modifiers = getContext('modifiers')
  const setcontrols = getContext('setcontrols')

	export let query = ''
	export let preview = false
	export let options = false
	export let titles = false
	export let auto = false
	export let pnum = 1
	export let size = 10
	export let result = []
  let exists = false
	let focused
	let timer = null
	let input
	let gb, sb
	let fresh = true

	const controls =(m, e)=> {
		if (e.key == 'Enter') {
			if (preview) {
				if (e.getModifierState('Shift')) gb.trigger()
				else sb.trigger()
			} else {
				sb.trigger()
			}
		} else if (e.key == 'Escape') {
			exit()
		}
	}
	const exit =()=> {
		if (input) input.exit()
	}
	const erase =()=> {
		input.erase()
	}
	const quit =()=> input.quit()
	const search =()=> {
		if (!query || query == '') {
			result = []
			timer = null
		} else {
			const opt = {pg: pnum, sz: size}
			if (titles) opt.inf = 'title'
			fullsearch(query, opt)
			.then(res=> {
				if (res.err == 0) {
					result = res.val
					timer = null
					fresh = false
				}
			})
		}
	}
	const delay =()=> {
    if (timer) clearTimeout(timer)
    timer = setTimeout(search, 500)
  }

	const edited =e=> {
		query = e.detail.val
	}

	$: if (auto) delay(query)
	else if (fresh && query) search()

	$: if (result.length) {
		exists = false
		result.forEach(i=> {
			if (i.title == query) exists = i
		})
	}

	$: markcg = !!$modifiers.Shift
	$: marksearch = !$modifiers.Shift

	$: if (focused) {
		setcontrols(controls)
	} else {
		setcontrols()
	}

	$: if (typeof(pnum) != 'number') pnum = parseInt(pnum)
</script>

<FB vert zero c="search-bar r2-s4">
  <Input
		bind:this={input}
		bind:focused={focused}
		on:edited={edited}
		value={query}
		text="SEARCH"
	>
		<svelte:fragment slot="extra">{#if preview}
			<FB between zero c="r2-row r2-top">
				<div class="r2-bar r2-hori"></div>
				<div class="r2-bar r2-hori"></div>
			</FB>
			<FB vert c="search-preview-wrapper">
				{#if result.items}
				<FB vert c="search-preview">
					{#each result.items as item}
						<FB leaf c="search-preview-item">
							<Link space={item.namespace} title={item.title} global><SearchEmph text={item.title}/></Link>
						</FB>
					{/each}
				</FB>
				{/if}

				<FB around c="search-controls">
				  {#if exists}
				    <Link global does={quit}
							space={exists.namespace}
							title={exists.title}
							marked={$modifiers.Shift}
							bind:this={gb}>
							GO
						</Link>
				  {:else}
				    <Link global does={quit}
							space={$loc.namespace || 'main'}
							title={query}
							disable={!query}
							marked={$modifiers.Shift}
							bind:this={gb}>
							CREATE
						</Link>
				  {/if}
					<Link does={quit}
						special="search" {query}
						disable={!query}
						marked={!$modifiers.Shift}
						bind:this={sb}>
						SEARCH
					</Link>
				</FB>
			</FB>
		{/if}</svelte:fragment>
		<svelte:fragment slot="buttons">{#if !preview}
			<Link does={quit}
				special="search" {query}
				disable={!query}
				marked={!$modifiers.Shift}
				bind:this={sb}>
				SEARCH
			</Link>
		{/if}</svelte:fragment>
		<svelte:fragment slot="options">{#if options}
			<Doc>
				<Line>
					<Check lab="TITLES"/>
					<Check lab="BODY"/>
					<FB leaf spacer={1}/>
					<Check lab="HISTORY"/>
					<FB expand/>
					<Lab txt="RESULTS"><Numeric double min={5} max={50}/></Lab>
				</Line>
			</Doc>
		{/if}</svelte:fragment>
	</Input>
</FB>
