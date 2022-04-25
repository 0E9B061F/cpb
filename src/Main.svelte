<script>
	import Link from './link/Link.svelte'
	import FB from './FB.svelte'

	import Debugger from './Debugger.svelte'
	import Headframe from './Headframe.svelte'
	import Titleframe from './Titleframe.svelte'
	import Bodyframe from './Bodyframe.svelte'
	import Footer from './Footer.svelte'
	import R2 from './r2/R2.svelte'
	import R2Hider from './r2/R2Hider.svelte'
	import WideUI from './WideUI.svelte'
	import Contents from './Contents.svelte'
	import LoadingScreen from './LoadingScreen.svelte'

	import Login from './special/Login.svelte'
	import User from './special/User.svelte'
	import Search from './special/Search.svelte'
	import Test from './special/Test.svelte'
	import TestForms from './special/TestForms.svelte'
	import TestLinks from './special/TestLinks.svelte'
	import E401 from './err/E401.svelte'
	import E404 from './err/E404.svelte'
	import E500 from './err/E500.svelte'
	import History from './History.svelte'
	import Viewer from './Viewer.svelte'
	import PageForm from './PageForm.svelte'

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
	let finished = writable(false)
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
	setContext('finished', finished)
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
		return fetch(url).then(res=> res.json())
		.then(r=> {
			console.log(`GET ${url}`)
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
			hold(`Created '${$gs.tag()}'`)
		}).catch(e=> handle(e))
	}
	const postuser =b=> {
		post('register', b).then(res=> {
			hold(`Created user '${b.handle}'`)
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
					hold(`Logged in as '${$session.val.handle}'`)
				}
				return true
			} else {
				if (res.err == 5) err(res.val.join('\n'))
				else err(`Sorry, an error occurred.`)
				return false
			}
    }).catch(e=> handle(e))
  }
	const register =b=> {
    return post('register', b)
  	.then(res=> {
			getsession()
			if (res.err == 0) {
				hold(`Registered as '${b.handle}'`)
				return true
			} else {
				if (res.err == 5) {
					hold(res.val.join('\n'))
				} else {
					hold(`Sorry, an error occurred.`)
				}
				return false
			}
    }).catch(e=> handle(e))
  }
	const logout =()=> {
    return post('logout', {})
		.then(r=> {
			getsession().then(s=> {
				if ($hassess) hold(`Logged out`)
			})
    })
  }

	setContext('login', login)
	setContext('register', register)
	setContext('logout', logout)

	const fortunes = [
		"a healthy air stinks of stupidity",
		"burning burning burning burning",
		"because it is my heart",
		"these fragments i have shored against my ruins",
		"where days are numbered",
		"devised by some ancient dread",
		"when found, make a note of",
	]
	let fortunebin = [...fortunes]
	let lastfortune = null

	const fortune =()=> {
		if (!fortunebin.length) {
			fortunebin = [...fortunes]
			if (lastfortune) {
				const n = fortunebin.indexOf(lastfortune)
				fortunebin.splice(n, 1)
			}
		}
		const s = util.sample(fortunebin)
		const n = fortunebin.indexOf(s)
    fortunebin.splice(n, 1)
		lastfortune = s
		return s
	}

	let heldmsg = null

	const unhold =(conf={})=> {
		if (heldmsg) {
			print(heldmsg)
			heldmsg = null
		} else {
			print(conf)
		}
	}
	const unmsg =()=> {
		print({
			text: fortune(),
			level: 'z',
			time: 0,
		})
	}
	let msgt
	const mkmsg =(conf={})=> {
		return Object.assign({
			text: '',
			level: 0,
			time: 3000,
		}, conf)
	}
	const hold =(conf={})=> {
		heldmsg = conf
	}
	const send =(conf={})=> {
		if (!$finished) hold(conf)
		else print(conf)
	}
	const msg =text=> {
		send({ text,
			level: 0, time: 3000
		})
	}
	const wrn =text=> {
		send({ text,
			level: 1, time: 5000
		})
	}
	const err =text=> {
		send({ text,
			level: 2, time: 0
		})
	}
	const print =(conf={})=> {
		$message = mkmsg(conf)
		console.log(`MESSAGE: ${$message.text}`)
		if (msgt) clearTimeout(msgt)
		if ($message.time) msgt = setTimeout(unmsg, $message.time)
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

	const errors = {
		401: E401,
		404: E404,
		500: E500,
	}

	const geterr =n=> {
		if (errors[n]) return errors[n]
		else return errors[500]
	}

	const blankstate =()=> {
		return {
			editing: false, creating: false, error: 0,
			current: false, head: false, old: false, anchor: false,
			system: false, history: false,
			pageperm: false, verperm: false,
			label: 'BLANK', cmp: null,
			namespace: null, title: null,
			loading: false, building: false, finished: false,
			loadstart: 0, loadtime: 0, buildstart: 0, buildtime: 0, finishtime: 0,
			fadestart: 0, fadetime: 0,
			editable: false, historical: false, byid: false,
		}
	}
	const sidestate =()=> {
		return Object.assign({}, $state)
	}

	let state = writable(blankstate())
	setContext('state', state)

	class Route {
		constructor(cmp, cnd=()=>true) {
			this.cmp = cmp
			this.cnd = cnd
		}
		resolve() {
			const r = this.cnd()
			if (typeof(r) == 'number') {
				return new Resolution(r)
			} else if (r === true) {
				return new Resolution(this.cmp)
			} else {
				return new Resolution(500)
			}
		}
	}

	class Router {
		constructor(routes) {
			this.routes = routes
		}
		has(p) {
			return !!this.routes[p]
		}
		nav(p) {
			if (this.has(p)) return this.routes[p].resolve()
			else return new Resolution(404)
		}
	}

	class Resolution {
		constructor(cmp) {
			if (typeof(cmp) == 'number') {
				this.err = cmp
				this.cmp = geterr(this.err)
			} else {
				this.err = 0
				this.cmp = cmp
			}
		}
	}


	const cpbspace = new Router({
		login: new Route(Login, ()=> !$haslogin || 401),
		register: new Route(Login, ()=> {
			if ($rc.singleuser) return 404
			else if (!$haslogin) return true
			else return 401
		}),
		user: new Route(User, ()=> !!$haslogin || 401),
		search: new Route(Search),
		test: new Route(Test),
		forms: new Route(TestForms),
		links: new Route(TestLinks),
	})
	setContext('cpbspace', cpbspace)

	const loadstate =()=> {
		const s = blankstate()
		s.loading = true
		s.label = 'LOADING'
		s.loadstart = Date.now()
		if ($loc.uuid) s.title = $loc.uuid
		else {
			s.namespace = $loc.namespace
			s.title = $loc.title
		}
		$state = s
	}

	let component = writable(null)
	setContext('component', component)

	const buildstate =()=> {
		console.log($hashistory)
		const s = sidestate()
		s.loading = false
		s.loadtime = Date.now() - s.loadstart
		if ($haspage && $loc.uuid) {
			if ($loc.uuid == $page.val.pageUuid) s.pageperm = true
			else if ($loc.uuid == $page.val.uuid) s.verperm = true
		}
		if ($hashistory && $loc.opt.history) {
			s.cmp = History
			s.history = true
			s.label = 'HISTORY'
	  } else if ($haspage && $loc.opt.edit) {
			if ($page.val.historical) {
				s.cmp = geterr(401)
				s.error = 401
				s.label = 'ERROR'
			} else {
				if ($haslogin) {
					s.cmp = PageForm
					s.editing = true
					s.label = 'EDIT'
				} else {
					s.cmp = geterr(401)
					s.error = 401
					s.label = 'ERROR'
				}
			}
		} else if ($loc.uuid) {
			if (!$haspage || $page && $page.err) {
				s.cmp = geterr(404)
				s.error = 404
				s.label = 'ERROR'
			} else {
				if ($haspage && $loc.uuid == $page.val.pageUuid) {
					s.cmp = Viewer
					s.head = true
					s.label = 'HEAD'
					s.editable = true
				} else if ($haspage && $page.val.nextUuid == null) {
					s.cmp = Viewer
					s.current = true
					s.label = 'CURRENT'
					s.editable = true
				} else {
					s.cmp = Viewer
					s.old = true
					s.label = 'OLD'
					s.historical = true
				}
				s.byid = true
				s.content = true
			}
		} else if ($page && $page.err == 1) {
			if ($haslogin) {
				s.cmp = PageForm
				s.creating = true
				s.label = 'NEW'
			} else {
				s.cmp = geterr(404)
				s.error = 404
				s.label = 'ERROR'
			}
		} else if ($haspage) {
			s.cmp = Viewer
			s.anchor = true
			s.label = 'ANCHOR'
			s.content = true
			s.editable = true
		} else if ($loc.namespace == $rc.syskey) {
			const res = cpbspace.nav($loc.title)
			if (res.err > 0) {
				s.label = 'ERROR'
				s.error = res.err
				s.cmp = geterr(res.err)
			} else {
				s.system = true
				s.label = 'SYSTEM'
				s.cmp = res.cmp
			}
		} else {
			s.cmp = geterr(500)
			s.error = 500
			s.label = 'ERROR'
		}
		if ($haspage) {
			s.namespace = $page.val.namespace
			s.title = $page.val.title
		} else {
			s.namespace = $loc.namespace
			s.title = $loc.title
		}
		s.building = true
		s.buildstart = Date.now()
		$component = s.cmp
		$state = s
		$creating = $state.creating
		$editing = $state.editing
	}

	const finishstate =()=> {
		const s = sidestate()
		const n = Date.now()
		s.building = false
		s.buildtime = n - s.buildstart
		s.fadestart = n
		$state = s
	}

	const finalstate =()=> {
		const s = sidestate()
		const n = Date.now()
		s.finishtime = n - s.loadstart
		s.fadetime = n - s.fadestart
		s.finished = true
		$state = s
	}

	const loadend =()=> {
		console.log('CPB LOAD END')
		parsenst()
		buildstate()
		renderstart = Date.now()
		$loading = false
		$fresh = false // XXX there's already a 'booted' variable
	}

	const endboot =()=> {
		msg('CPB BOOTED')
		console.log('CPB BOOTED')
		$booted = true
	}

	const finishinner =()=> {
		finalstate()
		$finished = true
		console.log('FINISHED')
		rendertime = Date.now() - renderstart
		if (!$booted) {
			if ($state.finishtime < $rc.fadein) {
				console.log('FADING')
				setTimeout(endboot, $rc.fadein - $state.finishtime)
			} else {
				console.log(`NOT FADING ${$state.finishtime} (${rc.fadein})`)
				endboot()
			}
		}
		unhold({
			text: 'FINISHED',
			level: 0,
			time: 2000
		})
	}

	const finishload =()=> {
		console.log('PRE-FINISH')
		finishstate()
		const d = Date.now() - $state.loadstart
		if (d >= $rc.fade) finishinner()
		else setTimeout(finishinner, $rc.fade - d)
	}
	setContext('finishload', finishload)

	const preload =p=> {
		console.log('CPB PRE-LOAD')
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
		} else {
			unhold('FINISHED', 0, 2000)
		}
	}

	let loadstart = 0
	let renderstart = 0
	let loadtime = 0
	let rendertime = 0

	const load =p=> {
		console.log('CPB LOAD')
		loadstart = Date.now()
		loadstate()
		$creating = false
		$editing = false
		$loading = true
		$finished = false
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
			if ($loc.title || $loc.namespace || $loc.uuid) {
				const a2 = $loc.uuid ? ['uuid', $loc.uuid] : ['get', $loc.namespace, $loc.title]
				after = grab(...a2).then(async page=> {
					if (page.val) page.val.historical = !!page.val.nextUuid
					const history = await grab('history', ...a, o)
					cleardata({page, history})
				})
			} else {
				after = grab('history', ...a, o).then(history=> {
					cleardata({history})
				})
			}
		} else if ($loc.title || $loc.namespace || $loc.uuid) {
			const a = $loc.uuid ? ['uuid', $loc.uuid] : ['get', $loc.namespace, $loc.title]
			after = grab(...a).then(page=> {
				if (page.val) page.val.historical = !!page.val.nextUuid
				cleardata({page})
			})
		}
		if (after) {
			after.then(r=> {
				loadend()
			}).catch(e=> handle(e))
		} else {
			loadend()
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
		print({text: 'LOADING', time: 0, level: 0})
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
    const t = p[1]?.replace(/_/g, ' ')
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
		if (m.Alt && e.code == 'KeyD') {
			setconf('debug', !getconf('debug'))
		} else if (m.Alt && e.code == 'KeyN') {
			setconf('darkmode', !getconf('darkmode'))
		} else if (m.Alt && e.code == 'KeyM') {
			setconf('autodark', !getconf('autodark'))
		} else if (m.Alt && e.code == 'KeyR') {
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
			p.push(`(${$loc.namespace.toUpperCase()})`)
			p.push($loc.title)
			if ($loc.cmd) {
				a.push(util.dedash($loc.cmd))
			}
		} else {
			p.push('SPECIAL')
			p.push($loc.special)
			if ($loc.special == 'search' && $loc.query) {
				a.push(`"${$loc.query}"`)
			}
		}
		p = p.join(' ')
		a = a.length ? `§ ${a.join(' ')}` : ''
		doctitle = ([...t, p, a]).join(' ')
	}
	$: mktitle($loc)

	let usedark = writable(false)
	setContext('usedark', usedark)
	$: if ($uc.autodark) {
		$usedark = window.matchMedia('(prefers-color-scheme: dark)').matches
	} else $usedark = $uc.darkmode

	let c = []
	const mkc =()=> {
		const nc = ['cpb-ui']
		if (!!$loading) nc.push('cpb-loading')
		else if (!$finished) nc.push('cpb-rendering')
		else nc.push('cpb-finished')
		nc.push(`${$uiname}-mode`)
		c = nc
	}


	let ww = writable(0)
	let wh = writable(0)

	setContext('ww', ww)
	setContext('wh', wh)

	let style
	let measures = {}
	const setcss =block=> {
		if (!style) return
		const conf = {}
		block(conf)
		Object.keys(conf).forEach(k=> {
			style.sheet.rules[0].style.setProperty(`--${k}`, `${conf[k]}px`)
		})
		return conf
	}
	$: if (style) {
		measures = setcss(c=> {
			c.basex = 1024
			c.wuicolx = 200
			c.pxgap = 5
			c.basemin = c.basex - (2 * c.pxgap)
			c.basereal = c.basex + (2 * c.pxgap)
			c.medx = c.basereal + c.wuicolx + c.pxgap
			c.widex = c.medx + c.wuicolx
			c.mainmax = 1200
			c.medw = c.wuicolx
			c.widew = (c.wuicolx * 2) + c.pxgap
		})
	}

	let ui = writable(2)
	let uiname = writable('base')
	const mkui =w=> {
		if (w >= measures.widex) return 3
		else if (w >= measures.medx) return 2
		else if (w >= measures.basereal) return 1
		else return 0
	}
	const uin = {
		[-1]: 'mobile',
		[+0]: 'base-min',
		[+1]: 'base',
		[+2]: 'medium',
		[+3]: 'wide',
	}
	const mkuin =n=> {
		return uin[n] || 'base'
	}
	$: $ui = mkui($ww, measures)
	$: $uiname = mkuin($ui)
	setContext('ui', ui)
	setContext('uiname', uiname)
	$: mkc($usedark, $loading, $finished, $uiname)

	const pageinfo = writable({})
	setContext('pageinfo', pageinfo)
	const setPageinfo =(wc, time, links)=> {
		$pageinfo = { wc, time, links }
	}
	setContext('setPageinfo', setPageinfo)

	let ready = false
	setTimeout(()=> ready = true, 2500)
</script>

<svelte:window
	on:keydown={keydown}
	on:keyup={keyup}
	bind:innerWidth={$ww}
	bind:innerHeight={$wh}
/>

<svelte:head>
	<title>{doctitle}</title>
	<style bind:this={style}>
		:root {
		}
	</style>
</svelte:head>

<div class="cpb-shell" class:darkmode={$usedark}>
<FB center {c} rel>
	<R2Hider hide={!$booted} hyper>
		<svelte:fragment slot="inner">
			<LoadingScreen/>
		</svelte:fragment>
	</R2Hider>
	<FB vert c="cpb-main" ghost={!$booted} flex={$ui >= 3}>
		{#if $uc.debug}<Debugger/>{/if}
		<Headframe/>
		<Contents bind:this={contentscmp}/>
	</FB>
	<WideUI ghost={!$booted}/>
</FB>
</div>
