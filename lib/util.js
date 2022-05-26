'use strict'

const rc = require('./rc.js')

const rep = {}
rep.hex = '[a-fA-F0-9]'
rep.uuid = `${rep.hex}{8}-(${rep.hex}{4}-){3}${rep.hex}{12}`
rep.nsident = '[a-z][a-z0-9]*'
rep.namespace = `${rep.nsident}(?:\\.${rep.nsident})*`
rep.titleh = "a-zA-Z0-9\\-.~\\[\\]@!$'()*,;%="
rep.titlet = `${rep.titleh}:_ `
rep.title = `[${rep.titleh}](?:[${rep.titlet}]*[${rep.titleh}])?`
rep.tail = `(?<tail>(?:\\/${rep.title})+)?`
rep.userident = `([a-zA-Z0-9][a-zA-Z0-9\\-]*)`
rep.uspart =(gn)=> `(?<${gn}>~${rep.userident}?)`
rep.nspart =(gn)=> `(?<${gn}>${rep.namespace})`
rep.tpart =(gn)=> `(?<${gn}>${rep.title})`
rep.nstcore = `(${rep.uspart('us')}|${rep.nspart('ns')}):${rep.tpart('t')}|${rep.uspart('jus')}|${rep.nspart('jns')}:|${rep.tpart('jt')}`
rep.nst = `(?:${rep.nstcore})${rep.tail}`
rep.hashident = `[a-zA-Z0-9\\-]+`
rep.hash = `(?:#(?<hash>${rep.hashident}))?`
rep.opts = `(?:\\?(?<opts>[^#]*))?`
rep.nstu = `\\/?(?:(?<uuid>${rep.uuid})|${rep.nst})${rep.opts}${rep.hash}`

const re = {}
re.hash = new RegExp(`^${rep.hash}$`)
re.uuid = new RegExp(`^${rep.uuid}$`)
re.title = new RegExp(`^${rep.title}$`)
re.nstu = new RegExp(`^(?:${rep.nstu})$`)

const gold = 1.618033988749894

const isuu =s=> {
  if (typeof(s) != 'string') return false
  return !!s.match(`^${rep.uuid}$`)
}

const mkq =o=> {
  const kvp = Object.entries(o).filter(p=> {
    return p[1] !== undefined && p[1] !== null
  }).map(p=> {
    if (p[1] === true) return p[0]
    else return `${p[0]}=${p[1]}`
  }).join('&')
  return kvp.length ? `?${kvp}` : ''
}
const rq =(q,tr={})=> {
  if (q[0] != '?') throw new Error('invalid query')
  q = q.slice(1)
  const o = {}
  q.split('&').forEach(kv=> {
    kv = kv.split('=')
    if (kv.length > 1) {
      o[kv[0]] = kv[1]
    } else {
      o[kv[0]] = true
    }
  })
  Object.keys(o).forEach(k=> {
    if (tr[k]) o[k] = tr[k](o[k])
    else if (typeof(o[k]) == 'string') {
      if (o[k].match(/^\d+$/)) o[k] = parseInt(o[k])
      else if (o[k].indexOf(',') > -1) o[k] = o[k].split(',')
    }
  })
  return o
}

const mask =(o,m)=> {
  const r = {}
  Object.keys(m).forEach(k=> {
    if (o[k]) r[k] = o[k]
    else if (m[k] !== undefined) r[k] = m[k]
  })
  return r
}

const grs =(c, s=[1])=> {
  if (c - 1 > 0) return grs(c-1, [...s, s[s.length-1] * gold])
  else return s
}
const grf =(f, ...a)=> {
  const s = grs(...a)
  const m = s[0]
  return s.map(x=> ((x - m) * f) + m)
}
const gild =(...n)=> {
  return n.map(x=> x * gold)
}

const tag =(ns, t)=> {
  if (!t) return `${ns}:`
  else if (ns == rc.defns) return `${t}`
  else return `${ns}:${t}`
}
const denst =nst=> {
  const out = {}
  const nt = nst.split(':')
  if (nt.length > 1) {
    out.space = nt[0]
    if (nt[1]) out.title = nt[1]
  } else {
    out.space = rc.defns
    out.title = nt[0]
  }
  return out
}

const rint =(min, max)=> {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const sample =a=> a[rint(0,a.length-1)]

const dedash =s=> {
  return s.split(/-+/).map(w=> w[0].toUpperCase()+w.slice(1)).join(' ')
}

module.exports = { isuu, grs, grf, gold, gild, rq, mkq, mask, tag, denst, rint, sample, dedash, rep, re }
