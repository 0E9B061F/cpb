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
	import SEO from './util/SEO.svelte'

	import Login from './special/Login.svelte'
	import User from './special/User.svelte'
	import Index from './special/Index.svelte'
	import Homepage from './special/Homepage.svelte'
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
	import CPB from '../lib/cpb.js'
	import { Fortune } from '../lib/fortune.mjs'

	let lastboot = localStorage.getItem('lastboot') || 0

	let lut

  let rc = writable(rco)
	let booted = writable(Date.now() - lastboot < $rc.bootwait)

	let aod = writable(0)

	let links = writable([])
	let linkmap = writable({})

	let oldstem = writable(null)
	let root = writable(window.location.pathname)
	let hash = writable(window.location.hash)
	let search = writable(window.location.search)
	let stem = writable($root + $search)
	let path = writable($stem + $hash)
	let canonical = writable(`${$rc.proto}://${$rc.domain}/${$path}`)
	const parseloc =()=> {
    const l = CPB.Location.parse($path)
		l.compare($loc)
    return l
  }
	let loc = writable({})

	const setpaths =()=> {
		$oldstem = $stem
		$root = window.location.pathname
		$search = window.location.search
		$hash = window.location.hash
		$stem = $root + $search
		$path = $stem + $hash
	}


	let fresh = writable(true)

	let session = writable({})

	let message = writable({})
	let loading = writable(true)
	let finished = writable(false)
	let debug = writable(true)

	let space = writable('')
	let title = writable('')

	let doctitle = writable({
		long: '',
		short: '',
	})

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
	setContext('stem', stem)
	setContext('canonical', canonical)
	setContext('loc', loc)
	setContext('fresh', fresh)
	setContext('session', session)
	setContext('message', message)
	setContext('loading', loading)
	setContext('finished', finished)
	setContext('debug', debug)
	setContext('space', space)
	setContext('title', title)
	setContext('doctitle', doctitle)
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

	const spath = `/${$rc.syskey}`
	const apath = `${spath}/${$rc.defapi}`
	const dpath = `${spath}/${$rc.defdata}`

	const burl =()=> `${$rc.proto}://${$rc.domain}${$rc.via ? ':'+$rc.via : ''}`
  const surl =()=> `${burl()}${spath}`
  const aurl =()=> `${burl()}${apath}`
	const durl =()=> `${burl()}${dpath}`

	const asset =name=> `${dpath}/${name}`
	const icon =name=> asset(`icons/${name}`)
	const asseturl =name=> `${burl()}${asset(name)}`
	const iurl =name=> asset(`images/${name}`)


	setContext('iurl', iurl)

	const mkurl =(conf={})=> {
		if (typeof(conf) == 'string') conf = { path: conf }
		conf = Object.assign({
			path: window.location.pathname,
			search: window.location.search,
			hash: window.location.hash,
		}, conf)
		return `${burl()}/${conf.path}${conf.search}${conf.hash}`
	}

	const cmdu =(c, ...a)=> {
		let o = null
		if (a.length) {
			if (typeof(a[a.length-1]) == 'object') o = a.pop()
			a = `/${a.join('/')}`
		} else a = ''
		let nstu = CPB.rc.api(c, a)
		if (o) nstu = nstu.amend({opts: o})
		return nstu.rel
	}

	const dbg =m=> {
		if (__CPB_DEVEL) {
			if (typeof(m) != 'string') {
				console.log(m)
			} else {
				console.log(`(DBG) ${m}`)
			}
		}
	}
	setContext('dbg', dbg)

	const grab =(...a)=> {
		const url = cmdu(...a)
		return fetch(url)
		.then(res=> res.json())
		.then(r=> {
			dbg(`GET ${url}`)
			dbg(r)
			return r
		})
		.catch(e=> {
			dbg(`GET ${url}`)
			dbg(e)
			return ({err: 6, msg: 'NETWORK ERROR'})
		})
	}

	// post('update', ns, t, {title, body})
	const postput =(method, ...a)=> {
		const body = a.pop()
		const url = cmdu(...a)
		let prom
		if (body instanceof FormData) {
			console.log('FOOOOOOOOOOOOOOOOOOOOOOOOOOO')
			prom = fetch(url, { method, body })
		} else {
			prom =  fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			})
		}
		return prom.then(res=> {
			console.log(res)
			return res.json()
		})
		.then(r=> {
			dbg(`${method} ${url}`)
			if (body instanceof FormData) dbg([...body.entries()], r)
			else dbg(body, r)
			return r
		})
		.catch(e=> {
			dbg(`${method} ${url}`)
			dbg(body, e)
			return ({err: 6, msg: 'NETWORK ERROR'})
		})
	}

	const post =(...a)=> { return postput('POST', ...a) }
	const put =(...a)=> { return postput('PUT', ...a) }

	const del =async(...a)=> {
		const url = cmdu(...a)
		let res = null
		try {
			res = await fetch(url, {
				method: 'DELETE',
			})
			res = res.json()
		} catch (e) {
			res = ({err: 99, msg: 'network error'})
		} finally {
			dbg(`DELETE ${url}`)
			dbg(res)
		}
		return res
	}

	const trash =async()=> {
		const res = await del('nstu', $loc.base, {mode: 'trash'})
		if (res.err == 0) $aod = Date.now()
		return res
	}
	const move =async(nstu)=> {
		if ($haspage) {
			nstu = CPB.NSTU.parse(nstu)
			const res = await put('nstu', $loc.base, {
				type: $page.val.resource.type,
				namespace: nstu.namespace,
				title: nstu.title,
			})
			if (res.err == 0) $aod = Date.now()
			return res
		}
	}
	const duplicate =async(nstu)=> {
		if ($haspage) {
			nstu = CPB.NSTU.parse(nstu)
			const res = await post('nstu', $loc.base, {
				type: 'dupe',
				namespace: nstu.namespace,
				title: nstu.title,
			})
			if (res.err == 0) $aod = Date.now()
			return res
		}
	}
	const exists =async(nstu)=> {
		nstu = CPB.NSTU.parse(nstu)
		const res = await grab('nstu', nstu.base)
		return res.err == 0
	}

	setContext('grab', grab)
	setContext('post', post)
	setContext('del', del)
	setContext('trash', trash)
	setContext('move', move)
	setContext('duplicate', duplicate)
	setContext('exists', exists)

	const setTokens =t=> {
		$tokens = t
	}
	setContext('setTokens', setTokens)

	const postdraft =()=> {
		const m = $loc.opt.edit ? 'PUT' : 'POST'
		return postput(m, 'nstu', $loc.normal, $draft).then(res=> {
			$draft = null
			if (!!$creating) $aod = Date.now()
			hold(`Created '${$gs.tag()}'`)
		}).catch(e=> handle(e))
	}

	setContext('postdraft', postdraft)

	const login =(hand, pass)=> {
		const start = $session.val.user.handle
    return post('nstu', `~${hand}`, {
			type: 'login', pass,
		})
  	.then(res=> {
			if (res.err == 0) {
				setsession(res)
				if (start != $session.val.user.handle) {
					hold(`Logged in as '${$session.val.user.handle}'`)
				}
				return true
			} else {
				if (res.err == 5) err(res.val.join('\n'))
				else err(`Sorry, an error occurred.`)
				return false
			}
    }).catch(e=> handle(e))
  }
	const register =(handle, pass, email)=> {
    return post('nstu', `~${handle}`, {
			type: 'user', email, pass
		})
  	.then(res=> {
			getsession()
			if (res.err == 0) {
				msg(`Registered as '${b.handle}'`)
				return true
			} else {
				if (res.err == 5) {
					err(res.val.join('\n'))
				} else {
					err(`Sorry, an error occurred.`)
				}
				return false
			}
    }).catch(e=> handle(e))
  }
	const logout =()=> {
    return post('nstu', '~', {type: 'logout'})
		.then(r=> {
			getsession().then(s=> {
				if ($hassess) msg(`Logged out`)
			})
    })
  }

	setContext('login', login)
	setContext('register', register)
	setContext('logout', logout)

	const fortunes = new Fortune([
		"a healthy air stinks of stupidity",
		"burning burning burning burning",
		"because it is my heart",
		"these fragments i have shored against my ruins",
		"where days are numbered",
		"devised by some ancient dread",
		"when found, make a note of",
	])

	const fortune =()=> fortunes.get()

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
		dbg(`MESSAGE: ${$message.text}`)
		if (msgt) clearTimeout(msgt)
		if ($message.time) msgt = setTimeout(unmsg, $message.time)
	}
	setContext('msg', msg)

	const fullsearch =(q, o={})=> {
		o = Object.assign(o, {
			get: 'list', q
		})
		return grab('nstu', o)
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
		put('nstu', `~`, {
			type: 'user', config: c,
		})
		.then(c=> {
			if (c.err == 0) $uc = c.val.user.config
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
		$haslogin = !!$hassess && !!$session.val.user.session.login
		if ($haslogin) {
			$uc = $session.val.user.config
		} else {
			if (localStorage.getItem('CPBUC')) loadls()
			else savels()
		}
		console.log(`LAUNCH: Got session (${$hassess}) ${$session.val.uuid}`)
	}

	const getsession =()=> {
		return grab('nstu', '~').then(v=> setsession(v))
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
			system: false, history: false, user: false,
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
		search: new Route(Search),
		test: new Route(Test),
		forms: new Route(TestForms),
		links: new Route(TestLinks),
		loading: new Route(LoadingScreen),
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
		const s = sidestate()
		s.loading = false
		s.loadtime = Date.now() - s.loadstart
		if ($haspage && $loc.uuid) {
			if ($loc.uuid.toLowerCase() == $page.val.resource.uuid) s.pageperm = true
			else if ($loc.uuid.toLowerCase() == $page.val.uuid) s.verperm = true
		}
		if (!$loc.uuid && !$loc.namespace) {
			s.cmp = Homepage
			s.home = true
			s.label = 'HOME'
		} else if ($loc.namespace && !$loc.title) {
			if ($loc.userspace) {
				s.cmp = User
				s.user = true
				s.label = 'USER'
			} else {
				s.cmp = Index
				s.index = true
				s.label = 'INDEX'
			}
		} else if ($hashistory && $loc.opt.history) {
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
					if ($haslogin) {
						s.editable = true
					}
				} else if ($haspage && $page.val.nextUuid == null) {
					s.cmp = Viewer
					s.current = true
					s.label = 'CURRENT'
					if ($haslogin) {
						s.editable = true
					}
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
			if ($haslogin) {
				s.editable = true
			}
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
		} else if ($loc.namespace || $loc.title) {
			s.namespace = $loc.namespace
			s.title = $loc.title
		} else {
			s.title = 'INDEX'
		}
		s.uuid = $loc.uuid
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
		localStorage.setItem('lastboot', Date.now())
	}

	const finishinner =()=> {
		finalstate()
		$finished = true
		console.log('FINISHED')
		rendertime = Date.now() - renderstart
		if (!$booted) {
			if ($state.finishtime < $rc.fadein) {
				dbg('FADING')
				setTimeout(endboot, $rc.fadein - $state.finishtime)
			} else {
				dbg(`NOT FADING ${$state.finishtime} (${rc.fadein})`)
				endboot()
			}
		}
		if ($loc.cmd) {
			scrollto($loc.cmd)
		} else {
			scrolltop(false)
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

	const scrollto =(id, smooth)=> {
		const e = document.getElementById(id)
		console.log(e)
		if (e) {
			dbg('SCROLLING')
			if (smooth) {
				e.scrollIntoView({
					behavior: "smooth",
				})
			} else {
				e.scrollIntoView()
			}
			e.focus({preventScroll: true})
		}
	}

	const preload =p=> {
		console.log('CPB PRE-LOAD')
		$loc = parseloc(p)
		if ($loc.rel != $path) {
			console.log($path)
			window.history.replaceState({}, $loc.rel, $loc.rel)
			setpaths()
		}
		if ($loc.load) load()
		else if ($loc.scroll && $loc.hash) {
			dbg(`SCROLLING TO ${$loc.cmd}`)
			scrollto($loc.hash)
		} else {
			dbg('NO LOAD')
			unhold('FINISHED', 0, 2000)
			//scrolltop(false)
		}
	}

	let loadstart = 0
	let renderstart = 0
	let loadtime = 0
	let rendertime = 0

	const load =p=> {
		console.log('CPB LOAD')
		print({text: 'LOADING', time: 0, level: 0})
		loadstart = Date.now()
		loadstate()
		$creating = false
		$editing = false
		$loading = true
		$finished = false
		cleardata()

		console.log($loc)

		let after = false
		if ($loc.namespace == $rc.syskey && cpbspace.has($loc.title)) {
			after = false
		} else if ($loc.userspace) {
			after = grab('nstu', $loc.base).then(user=> {
				cleardata({user})
			})
		} else if ($loc.opt.history) {
			const o = {get: 'hist'}
			if (!!$loc.opt.pg && $loc.opt.pg != $rc.historyDefaults.pg) o.pg = $loc.opt.pg
			if (!!$loc.opt.sz && $loc.opt.sz != $rc.historyDefaults.sz) o.sz = $loc.opt.sz
			if ($loc.title || $loc.namespace || $loc.uuid) {
				after = grab('nstu', $loc.base).then(async page=> {
					if (page.val) page.val.historical = !!page.val.nextUuid
					const history = await grab('nstu', $loc.base, o)
					cleardata({page, history})
				})
			} else {
				after = grab('nstu', $loc.base, o).then(history=> {
					cleardata({history})
				})
			}
		} else if ($loc.title || $loc.namespace || $loc.uuid) {
			const a = $loc.uuid ? ['uuid', $loc.uuid.toLowerCase()] : ['get', $loc.namespace, $loc.title]
			after = grab('nstu', $loc.base).then(page=> {
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
	const scrolltop =(smooth=true)=> {
		if (contentscmp) contentscmp.top(smooth)
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
			t = 'HOMEPAGE'
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
		setpaths()
		launch($path)
  }


	const modifiers = writable({
		Shift: false,
		Alt: false,
		Control: false,
	})
	setContext('modifiers', modifiers)
	const setmod =n=> $modifiers[n] = true
	const unsetmod =n=> $modifiers[n] = false

	const universals =(m, e)=> {
		// controls places here will not be overridden
	}
	const controls =(m, e)=> {
		// controls here may be overriddenn
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
	let controlset = [controls]
	const ctrl =c=> {
		if (!Array.isArray(c)) c = [c]
		return [universals, ...c]
	}
	const setcontrols =(...c)=> controlset = ctrl(c.length ? c : controls)
	const addcontrols =(...c)=> controlset = [...c, ...controlset]
	const rmcontrols =(...c)=> {
		controlset = controlset.filter(x=> c.indexOf(x) < 0)
	}
	const callctrl =(m,e)=> controlset.forEach(c=> c(m,e))

	const keydown =e=> {
		if ($modifiers.hasOwnProperty(e.key)) setmod(e.key)
		else callctrl($modifiers, e)
	}
	const keyup =e=> {
		if ($modifiers.hasOwnProperty(e.key)) unsetmod(e.key)
	}
	setContext('setcontrols', setcontrols)
	setContext('addcontrols', addcontrols)
	setContext('rmcontrols', rmcontrols)

  let gs = writable({
    full: p=> `${burl()}/${p}`,
    goto: (p)=> {
			dbg(`GOTO ${p}`)
			if (p != $path) {
				window.history.pushState({}, p, p)
			}
      setpaths()
			launch($path)
    },
    bounce: (d='/')=> {
      const p = trail[1] ? trail[1] : d
      window.history.pushState({}, p, p)
			setpaths()
			launch($path)
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
	launch($path)

	const mktitle =()=> {
		let long, short
		if (!$finished) {
			long = short = `${$rc.title} LOADING`
		} else if ($loc.uuid) {
			short = $loc.uuid.toUpperCase()
			if ($space && $title) short += ` / ${$space}:${$title}`
			if ($state.history) short += ' (HISTORY)'
			else if ($state.editing) short += ' (EDIT)'
			if ($loc.cmd) short += ` § ${util.dedash($loc.cmd)}`
			long = `${short} < ${$rc.title}`
		} else if ($loc.namespace) {
			short = $loc.title
			if ($loc.cmd) short += ` § ${util.dedash($loc.cmd)}`
			if ($state.history) short += ' (HISTORY)'
			else if ($state.editing) short += ' (EDIT)'
			long = short
			if ($loc.namespace != $rc.defns) long += ` < ${$loc.namespace.toUpperCase()}`
			long += ` < ${$rc.title}`
		} else {
			long = short = $rc.title
		}
		$doctitle = { long, short }
	}
	$: mktitle($loc, $finished, $space, $title)

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
			c.wuicolx = 200
			c.pxgap = 5
			c.subgap = 3
			c.margin = 30
			c.basex = 1024 + c.margin + c.pxgap
			c.basemin = c.basex - (3 * c.pxgap) - c.margin
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

	const blockInfo = writable({})
	setContext('blockInfo', blockInfo)
	const setBlockInfo =blocks=> {
		$blockInfo = blocks
	}
	setContext('setBlockInfo', setBlockInfo)

	const canonicalize =()=> {
		if ($state.content && $haspage) {
			$canonical = mkurl($page.val.uuid.toUpperCase())
		} else {
			$canonical = mkurl()
		}
	}

	$: canonicalize($loc, $finished)

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
	<title>{$doctitle.long}</title>
	<style bind:this={style}>
		:root {
		}
	</style>
	<SEO/>
</svelte:head>

<div class="cpb-shell" class:darkmode={$usedark}>
<FB center {c} rel>
	<R2Hider hide={!$booted} hyper>
		<svelte:fragment slot="inner">
			<LoadingScreen/>
		</svelte:fragment>
	</R2Hider>
	{#if !$rc.sidebar.onRight}<WideUI ghost={!$booted}/>{/if}
	<FB vert c="cpb-main" ghost={!$booted} flex={$ui >= 3}>
		{#if $uc.debug}<Debugger/>{/if}
		<Headframe/>
		<Contents bind:this={contentscmp}/>
	</FB>
	{#if $rc.sidebar.onRight}<WideUI ghost={!$booted}/>{/if}
</FB>
</div>
