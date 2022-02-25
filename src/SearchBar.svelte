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
  const rc = getContext('rc')
  const gs = getContext('gs')
  const path = getContext('path')
  const loc = getContext('loc')
  const fullsearch = getContext('fullsearch')
  const modifiers = getContext('modifiers')
  const setcontrols = getContext('setcontrols')

	export let query = ''
	export let preview = false
	export let options = false
	export let auto = false
	export let result = []
  let exists = false
	let focused
	let timer = null
	let input
	let gb, sb
	let fresh = true
	export let inf = 'title,body'
	let titleOpt, bodyOpt
	if (inf) {
		titleOpt = inf.split(',').indexOf('title') > -1
		bodyOpt = inf.split(',').indexOf('body') > -1
	} else {
		titleOpt = true
		bodyOpt = true
	}
	export let inhOpt = false
	export let szOpt = 25
	export let pgOpt = 1

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
			fullsearch(query, searchOpt)
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

	$: if (typeof(pgOpt) != 'number') pgOpt = parseInt(pgOpt)

	let searchOpt = {}
	const mkopts =()=> {
		const f = []
		if (titleOpt) f.push('title')
		if (bodyOpt) f.push('body')
		const o = {}
		if (szOpt != $rc.searchDefaults.sz) o.sz = szOpt
		if (f.join(',') != $rc.searchDefaults.inf.join(',')) o.inf = f
		if (inhOpt != $rc.searchDefaults.inh) o.inh = inhOpt
		if (pgOpt != $rc.searchDefaults.pg) o.pg = pgOpt
		searchOpt = o
	}
	$: mkopts(titleOpt, bodyOpt, szOpt, inhOpt)

	$: if (auto) delay(query)
	else if (fresh && query) search()
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
				bind:this={sb}
				opt={searchOpt}
				>
				SEARCH
			</Link>
		{/if}</svelte:fragment>
		<svelte:fragment slot="options">{#if options}
			<FB line>
				<Check lab="TITLES" bind:state={titleOpt}/>
				<Check lab="BODY" bind:state={bodyOpt}/>
				<FB leaf spacer={1}/>
				<Check lab="HISTORY" bind:state={inhOpt}/>
				<FB expand/>
				<Numeric double min={5} max={50} lab="RESULTS" bind:val={szOpt}/>
			</FB>
		{/if}</svelte:fragment>
	</Input>
</FB>
