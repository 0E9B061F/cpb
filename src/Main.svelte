<script>
	import Link from './Link.svelte'
	import FB from './FB.svelte'

	import Debugger from './Debugger.svelte'
	import Headframe from './Headframe.svelte'
	import Titleframe from './Titleframe.svelte'
	import Bodyframe from './Bodyframe.svelte'
	import Footer from './Footer.svelte'
	import Messenger from './Messenger.svelte'

  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'

	import rco from '../lib/rc.js'


	let lut

  let rc = writable(rco)

	let aod = writable(0)

	let links = writable([])
	let linkmap = writable({})

	let path = writable(window.location.pathname + window.location.hash)
	let loc = writable({})

	let session = writable({})

	let message = writable({})
	let loading = writable(true)
	let debug = writable(true)

	let space = writable('')
	let title = writable('')

	let page = writable(null)
	let user = writable(null)
	let history = writable(null)

	let trail = writable([])
	$: if ($path != $trail[0]) $trail.unshift($path)

	let haspage = writable(false)
	let hashistory = writable(false)
	let hasuser = writable(false)
	let hassess = writable(null)
	let haslogin = writable(false)

	let uc = writable({
		debug: false,
	})

  setContext('rc', rc)
  setContext('aod', aod)
	setContext('links', links)
	setContext('linkmap', linkmap)
	setContext('path', path)
	setContext('loc', loc)
	setContext('session', session)
	setContext('message', message)
	setContext('loading', loading)
	setContext('debug', debug)
	setContext('space', space)
	setContext('title', title)
	setContext('page', page)
	setContext('user', user)
	setContext('history', history)
	setContext('trail', trail)
	setContext('haspage', haspage)
	setContext('hashistory', hashistory)
	setContext('hasuser', hasuser)
	setContext('hassess', hassess)
	setContext('haslogin', haslogin)
	setContext('uc', uc)


	const handle =e=> {
		if ($uc.debug) console.log(e)
		else console.log('ERROR')
	}

	const burl =()=> `${$rc.proto}://${$rc.domain}${$rc.port ? ':'+$rc.port : ''}`
  const surl =()=> `${burl()}/${$rc.syskey}`
  const aurl =()=> `${surl()}/${$rc.defapi}`
	const cmdu =(c, ...a)=> {
		a = a.length? `/${a.join('/')}` : ''
		return`${aurl()}/${c}${a}`
	}

	const grab =(...a)=> {
		return fetch(cmdu(...a)).then(res=> res.json())
		.then(r=> {
			console.log(cmdu(...a))
			console.log(r)
			return r
		})
	}

	// post('update', ns, t, {title, body})
	const post =(...a)=> {
		const body = a.pop()
		return fetch(cmdu(...a), {
			method: 'POST',
			body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
		}).then(res=> res.json())
		.then(r=> {
			console.log(cmdu(...a))
			console.log(r)
			return r
		})
	}

	const postpage =b=> {
		const a = $loc.uuid ? [$loc.uuid] : [$loc.namespace, $loc.title]
		return post('get', ...a, b).then(res=> {
			$aod = Date.now()
			msg(`Created '${$gs.tag()}'`)
		}).catch(e=> handle(e))
	}
	const updatepage =b=> {
		const a = $loc.uuid ? [$loc.uuid] : [$loc.namespace, $loc.title]
		return post('update', ...a, b).then(res=> {
			msg(`Saved changes to '${$gs.tag()}'`)
		}).catch(e=> handle(e))
	}
	const postuser =b=> {
		post('register', b).then(res=> {
			msg(`Created user '${b.handle}'`)
		}).catch(e=> handle(e))
	}

	setContext('postpage', postpage)
	setContext('updatepage', updatepage)
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
			console.log(res)
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

	const msg =(text='', level=0)=> {
		$message = { text, level }
	}
	setContext('msg', msg)

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
		console.log(`LAUNCH: Data check - user: ${$hasuser} - page: ${$haspage} - hist: ${$hashistory}`)
	}

	const load =p=> {
		$loading = true
		cleardata()
		$loc = parseloc(p)

		let after = false
		if ($loc.special == 'user') {
			after = grab('user', $session.val.handle).then(user=> {
				cleardata({user})
			})
		} else if ($loc.cmd == 'history') {
			const a = $loc.uuid ? [$loc.uuid] : [$loc.namespace, $loc.title]
			after = grab('history', ...a).then(history=> {
				cleardata({history})
			})
		} else if ($loc.uuid || $loc.namespace) {
			const a = $loc.uuid ? ['uuid', $loc.uuid] : ['get', $loc.namespace, $loc.title]
			after = grab(...a).then(page=> {
				if (page.val) page.val.historical = !!page.val.childVuuid
				console.log(page)
				cleardata({page})
			})
		}
		if (after) {
			after.then(r=> {
				parsenst()
				$loading = false
			}).catch(e=> handle(e))
		} else {
			parsenst()
			$loading = false
		}
	}

	const launch =p=> {
		console.log('COMMONPLACE BOOK: LAUNCH')
		console.log(`LAUNCH: ${JSON.stringify($rc)}`)
		if ($hassess) load($path)
		else getsession().then(s=> load($path))
	}

  const parseloc =p=> {
    const loc = {
      namespace: null, title: null, uuid: null,
      special: null, cmd: null
    }
    p = p.split('#')
    if (p[1]) loc.cmd = p[1]
    p = p[0]
    if (p[0] == '/') p = p.slice(1)
    p = p.split('/')
    const ns = p[0]
    const t = p[1]
		console.log(ns, t)
    const hex = '[a-fA-F0-9]'
    if (ns == $rc.syskey) {
			console.log('in sys space')
      if (t == $rc.deflogin) {
        loc.special = 'login'
      } else if (t == $rc.defuser) {
        loc.special = 'user'
      } else {
        loc.special = 'e404'
      }
    } else {
			console.log('in content space')
			loc.special = 'content'
			if (ns.match(`${hex}{8}-(${hex}{4}-){3}${hex}{12}`)) {
	      loc.uuid = ns
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
			t = $loc.special
		}
		$space = ns
		$title = t
	}

	const linkupdate =links=> {
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

	const controls =e=> {
		if (event.keyCode == 8) {
			setconf('debug', !getconf('debug'))
		}
	}

  let gs = writable({
    full: p=> `${burl()}/${p}`,
    goto: p=> {
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
	$: launch($path)
</script>

<svelte:window on:keydown={controls}/>

<FB center c="cpb-ui">
	<FB vert c="cpb-main">
		{#if $uc.debug}<Debugger/>{/if}
	  <Headframe/>
	  <Titleframe/>
	  <Messenger/>
	  <FB expand leaf><Bodyframe/></FB>
	  <Footer/>
	</FB>
</FB>
