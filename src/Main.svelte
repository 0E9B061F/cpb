<script>
	import Link from './Link.svelte'
	import FB from './FB.svelte'

	import Debugger from './Debugger.svelte'
	import Headframe from './Headframe.svelte'
	import Titleframe from './Titleframe.svelte'
	import Bodyframe from './Bodyframe.svelte'
	import Footer from './Footer.svelte'
	import R2 from './r2/R2.svelte'
	import R2Over from './r2/R2Over.svelte'
	import RecentPages from './RecentPages.svelte'
	import SearchBar from './SearchBar.svelte'
	import TOC from './TOC.svelte'
	import Contents from './Contents.svelte'

  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'

	import rco from '../lib/rc.js'
	import util from '../lib/util.js'


	let booted = writable(false)
	let lut

  let rc = writable(rco)

	let aod = writable(0)

	let links = writable([])
	let linkmap = writable({})

	let path = writable(window.location.pathname + window.location.search + window.location.hash)
	let stem = writable(window.location.pathname + window.location.search)
	let hash = writable(window.location.hash)
	let loc = writable({})

	let fresh = writable(true)

	let session = writable({})

	let message = writable({})
	let loading = writable(true)
	let debug = writable(true)

	let space = writable('')
	let title = writable('')

	let page = writable(null)
	let tokens = writable(null)
	let user = writable(null)
	let history = writable(null)
	let draft = writable(null)

	let trail = writable([])

	let creating = writable(false)
	let editing = writable(false)

	let haspage = writable(false)
	let hashistory = writable(false)
	let hasuser = writable(false)
	let hassess = writable(null)
	let haslogin = writable(false)

	let uc = writable({
		debug: false,
		darkmode: false,
		autodark: true,
	})

  setContext('booted', booted)
  setContext('rc', rc)
  setContext('aod', aod)
	setContext('links', links)
	setContext('linkmap', linkmap)
	setContext('path', path)
	setContext('loc', loc)
	setContext('fresh', fresh)
	setContext('session', session)
	setContext('message', message)
	setContext('loading', loading)
	setContext('debug', debug)
	setContext('space', space)
	setContext('title', title)
	setContext('page', page)
	setContext('tokens', tokens)
	setContext('user', user)
	setContext('history', history)
	setContext('draft', draft)
	setContext('trail', trail)
	setContext('creating', creating)
	setContext('editing', editing)
	setContext('haspage', haspage)
	setContext('hashistory', hashistory)
	setContext('hasuser', hasuser)
	setContext('hassess', hassess)
	setContext('haslogin', haslogin)
	setContext('uc', uc)


	const handle =e=> {
		// XXX
		throw e
	}
	setContext('handle', handle)

	const burl =()=> `${$rc.proto}://${$rc.domain}${$rc.port ? ':'+$rc.port : ''}`
  const surl =()=> `${burl()}/${$rc.syskey}`
  const aurl =()=> `${surl()}/${$rc.defapi}`
	const cmdu =(c, ...a)=> {
		let o = ''
		if (a.length) {
			if (typeof(a[a.length-1]) == 'object') {
				o = util.mkq(a.pop())
			}
			a = `/${a.join('/')}`
		} else a = ''
		return`${aurl()}/${c}${a}${o}`
	}

	const grab =(...a)=> {
		const url = cmdu(...a)
		console.log(`GET ${url}`)
		return fetch(url).then(res=> res.json())
		.then(r=> {
			console.log(r)
			return r
		})
	}

	// post('update', ns, t, {title, body})
	const post =(...a)=> {
		const body = a.pop()
		const url = cmdu(...a)
		console.log(`POST ${url}`)
		return fetch(url, {
			method: 'POST',
			body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
		}).then(res=> res.json())
		.then(r=> {
			return r
		})
	}

	setContext('grab', grab)
	setContext('post', post)

	const setTokens =t=> {
		$tokens = t
	}
	setContext('setTokens', setTokens)

	const postdraft =()=> {
		const a = $loc.uuid ? [$loc.uuid] : [$loc.namespace, $loc.title]
		const c = $loc.opt.edit ? 'update' : 'get'
		return post(c, ...a, $draft).then(res=> {
			$draft = null
			if (!!$creating) $aod = Date.now()
			msg(`Created '${$gs.tag()}'`)
		}).catch(e=> handle(e))
	}
	const postuser =b=> {
		post('register', b).then(res=> {
			msg(`Created user '${b.handle}'`)
		}).catch(e=> handle(e))
	}

	setContext('postdraft', postdraft)
	setContext('postuser', postuser)

	const login =b=> {
		const start = $session.val.handle
    return post('login', b)
  	.then(res=> {
			setsession(res)
			if (res.err == 0) {
				if (start != $session.val.handle) {
					msg(`Logged in as '${$session.val.handle}'`)
				}
				return true
			} else {
				if (res.err == 5) msg(res.val.join('\n'))
				else msg(`Sorry, an error occurred.`)
				return false
			}
    }).catch(e=> handle(e))
  }
	const register =b=> {
    return post('register', b)
  	.then(res=> {
			getsession()
			if (res.err == 0) {
				msg(`Registered as '${b.handle}'`)
				return true
			} else {
				if (res.err == 5) {
					msg(res.val.join('\n'))
				} else {
					msg(`Sorry, an error occurred.`)
				}
				return false
			}
    }).catch(e=> handle(e))
  }
	const logout =()=> {
    return post('logout', {})
		.then(r=> {
			getsession().then(s=> {
				if ($hassess) msg(`Logged out`)
			})
    })
  }

	setContext('login', login)
	setContext('register', register)
	setContext('logout', logout)

	const unmsg =()=> {
		$message = { text: '', level: 0 }
	}
	let msgt
	const msg =(text='', level=0)=> {
		$message = { text, level }
		if (msgt) clearTimeout(msgt)
		msgt = setTimeout(unmsg, 5000)
	}
	setContext('msg', msg)

	const fullsearch =(q, o={})=> {
		return grab('search', q, o)
		.catch(e=> handle(e))
	}
	setContext('fullsearch', fullsearch)

	const getconf =k=> {
		return $uc[k]
	}
	const setconf =(k,v)=> {
		$uc[k] = v
		if ($haslogin) saveconf({[k]: v})
		else savels()
	}
	const saveconf =c=> {
		post('config', $session.val.handle, c)
		.then(c=> {
			if (c.err == 0) $uc = c.val
		})
		.catch(e=> handle(e))
	}
	const savels =()=> {
		localStorage.setItem('CPBUC', JSON.stringify($uc))
	}
	const loadls =()=> {
		$uc = JSON.parse(localStorage.getItem('CPBUC'))
	}

	const setsession =s=> {
		$session = s
		$hassess = !!$session && $session.err == 0 && !!$session.val
		$haslogin = !!$hassess && !!$session.val.login
		if ($haslogin) {
			$uc = $session.val.config
		} else {
			if (localStorage.getItem('CPBUC')) loadls()
			else savels()
		}
		console.log(`LAUNCH: Got session (${$hassess}) ${$session.val.uuid}`)
	}

	const getsession =()=> {
		return grab('session').then(s=> setsession(s))
	}

	const cleardata =(to={})=> {
		$tokens = null
		if (to.user) $user = to.user
		else if ($user) $user = null
		if (to.page) $page = to.page
		else if ($page) $page = null
		if (to.history) $history = to.history
		else if ($history) $history = null
		checkdata()
	}

	const checkresp =r=> !!r && r.err == 0 && !!r.val

	const checkdata =()=> {
		$hasuser = checkresp($user)
		$haspage = checkresp($page)
		$hashistory = checkresp($history)
	}

	const loadend =()=> {
		parsenst()
		if (!!$page && $page.err == 1) $creating = true
		else if ($loc.opt.edit) $editing = true
		if (!$booted) {
			msg('CPB BOOTED')
			$booted = true
		}
		$loading = false
		$fresh = false
	}

	const loadshim =t=> {
		const d = Date.now() - t
		if (d >= $rc.fade) loadend()
		else setTimeout(loadend, $rc.fade - d)
	}

	const preload =p=> {
		$loc = parseloc(p)
		if ($loc.load) load()
		else if ($loc.cmd) {
			const e = document.getElementById($loc.cmd)
			if (e) {
				e.scrollIntoView({
  				behavior: "smooth",
  				block: "start",
  				inline: "nearest"
				})
				e.focus({preventScroll: true})
			}
		}
	}

	const load =p=> {
		const loadstart = Date.now()
		$creating = false
		$editing = false
		$loading = true
		cleardata()

		let after = false
		if ($loc.namespace == $rc.syskey) {
			if ($loc.title == 'user') {
				let u = $loc.sub[0]
				if (!u && !!$haslogin) u = $session.val.handle
				if (u) {
					after = grab('user', u).then(user=> {
						cleardata({user})
					})
				}
			}
		} else if ($loc.opt.history) {
			const a = $loc.uuid ? [$loc.uuid] : [$loc.namespace, $loc.title]
			const o = {}
			if (!!$loc.opt.pg && $loc.opt.pg != $rc.historyDefaults.pg) o.pg = $loc.opt.pg
			if (!!$loc.opt.sz && $loc.opt.sz != $rc.historyDefaults.sz) o.sz = $loc.opt.sz
			after = grab('history', ...a, o).then(history=> {
				cleardata({history})
			})
		} else if ($loc.title || $loc.namespace || $loc.uuid) {
			const a = $loc.uuid ? ['uuid', $loc.uuid] : ['get', $loc.namespace, $loc.title]
			after = grab(...a).then(page=> {
				if (page.val) page.val.historical = !!page.val.nextUuid
				cleardata({page})
			})
		}
		if (after) {
			after.then(r=> {
				loadshim(loadstart)
			}).catch(e=> handle(e))
		} else {
			loadshim(loadstart)
		}
	}

	let contentscmp
	const scrolltop =()=> {
		if (contentscmp) contentscmp.top()
	}
	setContext('scrolltop', scrolltop)
	let scrollinfo = writable({ch: 0, sh: 0, sy: 0, scrollable: false, scrolled: false})
	setContext('scrollinfo', scrollinfo)
	const updatescroll =(ch, sh, sy, scrollable, scrolled)=> {
		$scrollinfo = {ch, sh, sy, scrollable, scrolled}
	}
	setContext('updatescroll', updatescroll)

	const reload =()=> {
		launch($path)
	}
	setContext('reload', reload)

	const launch =p=> {
		console.log('COMMONPLACE BOOK: LAUNCH')
		if ($hassess) preload($path)
		else getsession().then(s=> preload($path))
	}

	const drophash =()=> {
		if ($hash) $gs.goto($stem)
	}
	setContext('drophash', drophash)

  const parseloc =p=> {
    const loc = {
      namespace: null, title: null,
			uuid: null, sub: [],
			cmd: null, opt: {},
			load: true,
    }
    p = p.split('#')
		if (!$fresh && p[0] == $stem) loc.load = false
		$stem = p[0] || null
		$hash = p[1] || null
		loc.cmd = $hash
    p = p[0].split('?')
		if (p[1]) {
			loc.opt = util.mask(util.rq('?' + p[1]), {
				pg: undefined, sz: undefined,
				inf: undefined, inh: undefined,
				edit: undefined, history: undefined,
			})
		}
		p = p[0]
    if (p[0] == '/') p = p.slice(1)
    p = p.split('/')
    const ns = p[0]
    const t = p[1]
    const args = p.slice(2)
		loc.sub = args
		let u
		if (ns.startsWith($rc.homekey)) {
			loc.namespace = $rc.syskey
			loc.title = 'user'
			u = ns.slice(1)
			if (u) loc.sub = [u]
		} else if (ns == $rc.syskey) {
			loc.namespace = $rc.syskey
			if (t) loc.title = t
    } else {
			if (util.isuu(ns)) {
	      loc.uuid = ns.toLowerCase()
	    } else if (ns == '') {
	      loc.namespace = $rc.defns
	      loc.title = $rc.deftitle
	    } else if (!t) {
	      loc.namespace = ns
	      loc.title = $rc.deftitle
	    } else {
	      loc.namespace = ns
	      loc.title = t
	    }
		}
    return loc
  }

	const parsenst =()=> {
		let ns, t
		if ($haspage) {
			ns = $page.val.namespace
			t = $page.val.title
		} else if ($loc.uuid) {
			ns = 'ID'
			t = $loc.uuid
		} else if ($loc.namespace || $loc.title) {
			ns = $loc.namespace || ''
			t = $loc.title || ''
		} else {
			ns = 'SPECIAL'
			t = $loc.special.toUpperCase()
		}
		$space = ns
		$title = t
	}

	const linkupdate =links=> {
		if (!links.length) return
    const titles = [...new Set(links)].join('+')
    grab('missing', titles)
    .then(res=> $linkmap = res)
		.catch(e=> handle(e))
  }

	const mklut =links=> {
    if (lut) clearTimeout(lut)
    lut = setTimeout(linkupdate, 200, links)
  }

	const onpop =e=> {
    $path = window.location.pathname
  }


	const modifiers = writable({
		Shift: false,
		Alt: false,
		Control: false,
	})
	setContext('modifiers', modifiers)
	const setmod =n=> $modifiers[n] = true
	const unsetmod =n=> $modifiers[n] = false

	const controls =(m, e)=> {
		if (m.Shift && e.code == 'KeyD') {
			setconf('debug', !getconf('debug'))
		} else if (m.Shift && e.code == 'KeyR') {
			reload()
		}
	}
	let controlset = controls
	const setcontrols =c=> controlset = c ? c : controls

	const keydown =e=> {
		if ($modifiers.hasOwnProperty(e.key)) setmod(e.key)
		else controlset($modifiers, e)
	}
	const keyup =e=> {
		if ($modifiers.hasOwnProperty(e.key)) unsetmod(e.key)
	}
	setContext('setcontrols', setcontrols)

  let gs = writable({
    full: p=> `${burl()}/${p}`,
    goto: (p)=> {
      $path = p
      window.history.pushState({}, $path, $path)
    },
    bounce: (d='/')=> {
      $path = trail[1] ? trail[1] : d
      window.history.pushState({}, $path, $path)
    },
    tag: ()=> {
      return `${$loc.namespace}:${$loc.title}`
    },
    bare: ()=> $path.split('#')[0],
    cur: ()=> `${burl()}/${$path}`,
  })

  setContext('gs', gs)

  window.onpopstate = onpop

	msg()
	$: mklut($links)
	$: if ($path != $trail[0]) {
		$trail.unshift($path)
		$trail = $trail
	}
	$: launch($path)

	let doctitle = ''
	const mktitle =()=> {
		let t = [$rc.title]
		let p = []
		let a = []
		if ($loc.title) {
			p.push($loc.namespace.toUpperCase())
			p.push($loc.title)
			if ($loc.cmd) {
				a.push($loc.cmd.toUpperCase())
			}
		} else {
			p.push('SPECIAL')
			p.push($loc.special)
			if ($loc.special == 'search' && $loc.query) {
				a.push(`"${$loc.query}"`)
			}
		}
		p = p.join(' ▸ ')
		a = a.length ? `(${a.join(' ')})` : ''
		doctitle = ([...t, p, a]).join(' ')
	}
	$: mktitle($loc)

	$: darkcls = $uc.darkmode ? 'darkmode' : ''
</script>

<svelte:window on:keydown={keydown} on:keyup={keyup} />

<svelte:head>
	<title>{doctitle}</title>
</svelte:head>

<FB center c="cpb-ui {darkcls}">
	<FB vert c="cpb-main">
		{#if $uc.debug}<Debugger/>{/if}
	  <Headframe/>
		<Contents bind:this={contentscmp}/>
	</FB>
	<FB vert c="medium-right">
		<FB c="sbwrap">
			<SearchBar preview auto inf="title" szOpt={5}/>
		</FB>
		<TOC/>
		<FB spacer={3}/>
		<RecentPages count={10}/>
	</FB>
</FB>
