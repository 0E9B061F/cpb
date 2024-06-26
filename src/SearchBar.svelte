<script>
	import FB from './FB.svelte'
	import Doc from './doc/Doc.svelte'
	import Line from './doc/Line.svelte'
	import Lab from './doc/Lab.svelte'
	import Link from './link/Link.svelte'
	import Input from './doc/Input.svelte'
	import Check from './doc/Check.svelte'
	import Numeric from './doc/Numeric.svelte'
	import SearchEmph from './SearchEmph.svelte'

  import { getContext, createEventDispatcher } from 'svelte'
	import CPB from '../lib/cpb.js'
	const dispatch = createEventDispatcher()
  const rc = getContext('rc')
  const gs = getContext('gs')
  const path = getContext('path')
  const loc = getContext('loc')
  const fullsearch = getContext('fullsearch')
  const exists = getContext('exists')
  const modifiers = getContext('modifiers')
  const setcontrols = getContext('setcontrols')
  const haslogin = getContext('haslogin')

	export let query = ''
	export let preview = false
	export let options = false
	export let auto = false
	export let result = null
	export let namespace = null
  let exact = false
  let nstu = null
	let focused
	let timer = null
	let input
	let gb, sb
	let fresh = true
	export let inf = 'title,source'
	let titleOpt, sourceOpt
	if (inf) {
		titleOpt = inf.split(',').indexOf('title') > -1
		sourceOpt = inf.split(',').indexOf('source') > -1
	} else {
		titleOpt = true
		sourceOpt = true
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
	const search =(after=null)=> {
		fullsearch(searchOpt, namespace)
		.then(res=> {
			dispatch('done')
			if (after) after()
			if (res.err == 0) {
				res.val.forEach(i=> i.nstu = new CPB.NSTU({namespace: i.namespace, title: i.title}))
				result = res
				timer = null
				fresh = false
				changed = false
			}
		})
	}
	const check =()=> {
		exists(nstu).then(res=> exact = res)
	}
	const manualSearch =()=> {
		search(()=> exit())
	}
	const clear =()=> {
		erase()
	}
	const autoSearch =()=> {
		if (!query) {
			result = null
			timer = null
			changed = false
			exact = false
		} else {
			check()
			search()
		}
	}
	const delay =()=> {
    if (timer) clearTimeout(timer)
    timer = setTimeout(autoSearch, 500)
  }

	const edited =e=> {
		query = e.detail.val
	}

	$: markcg = !!$modifiers.Shift
	$: marksearch = !$modifiers.Shift

	$: if (focused) {
		setcontrols(controls)
	} else {
		setcontrols()
	}

	$: if (typeof(pgOpt) != 'number') pgOpt = parseInt(pgOpt) || null

	let changed = false

	let searchOpt = {}
	const mkopts =()=> {
		let f
		if (titleOpt && sourceOpt) f = 'both'
		else if (titleOpt) f = 'title'
		else if (sourceOpt) f = 'source'
		else f = 'both'
		const o = {}
		if (szOpt != $rc.searchDefaults.sz) o.sz = szOpt
		if (f != $rc.searchDefaults.inf) o.inf = f
		if (inhOpt != $rc.searchDefaults.inh) o.inh = inhOpt
		if (pgOpt != $rc.searchDefaults.pg) o.pg = pgOpt
		if (query) o.q = query
		o.type = 'page,image' 
		searchOpt = o
		changed = true
	}
	$: nstu = query ? CPB.NSTU.parse(query).amend({from: $loc.namespace || $rc.defns}) : null
	$: mkopts(titleOpt, sourceOpt, szOpt, inhOpt, query, pgOpt)

	$: if (auto) delay(query)
	$: if (!auto) search(false, pgOpt)

	$: createin = $loc.namespace && $loc.namespace != $rc.syskey ? $loc.namespace : $rc.defns
</script>

<FB vert zero c="search-bar r2-s4">
  <Input
		bind:this={input}
		bind:focused={focused}
		on:edited={edited}
		value={query}
		useExtra={preview}
		text="SEARCH"
	>
		<svelte:fragment slot="extra">{#if preview}
			<FB vert c="search-preview-wrapper">
				{#if result && result.val}
				<FB vert c="search-preview">
					{#each result.val as item}
						<FB leaf line c="search-preview-item">
							<Link does={quit} space={item.namespace} title={item.title} nored><SearchEmph text={item.search.title || item.title}/></Link>
						</FB>
					{/each}
				</FB>
				{/if}

				<FB around c="search-controls">
				  {#if nstu && exact}
				    <Link global does={quit}
							disable={!nstu}
							nst={nstu?.rel}
							marked={$modifiers.Shift}
							bind:this={gb}>
							GO
						</Link>
				  {:else if $haslogin}
				    <Link global does={quit}
							disable={!nstu || !$haslogin}
							nst={nstu?.rel}
							marked={$modifiers.Shift}
							bind:this={gb}>
							CREATE
						</Link>
				  {/if}
					<Link does={quit}
						nst="" opt={{q: query}}
						disable={!query}
						marked={$haslogin && !$modifiers.Shift}
						bind:this={sb}>
						SEARCH
					</Link>
				</FB>
			</FB>
		{/if}</svelte:fragment>
		<svelte:fragment slot="buttons">{#if !preview}
			<Link does={manualSearch}
				precise
				space={namespace}
				overload
				disable={!changed}
				bind:this={sb}
				opt={searchOpt}
				>
				{#if query}SEARCH{:else}LIST{/if}
			</Link>
		{/if}</svelte:fragment>
		<svelte:fragment slot="options">{#if options}
			<FB line>
				<Check lab="TITLE" bind:state={titleOpt}/>
				<Check lab="SOURCE" bind:state={sourceOpt}/>
				<FB leaf spacer={1}/>
				<Check lab="HISTORY" bind:state={inhOpt}/>
				<FB expand/>
				<Numeric double min={5} max={50} lab="RESULTS" bind:val={szOpt}/>
			</FB>
		{/if}</svelte:fragment>
	</Input>
</FB>
