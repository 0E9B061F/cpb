'use strict'


const hex = '[a-fA-F0-9]'
const gold = 1.618033988749894

const isuu =s=> {
  if (typeof(s) != 'string') return false
  return !!s.match(`^${hex}{8}-(${hex}{4}-){3}${hex}{12}$`)
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

module.exports = { isuu, grs, grf, gold, gild }
