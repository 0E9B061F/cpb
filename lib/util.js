'use strict'


const hex = '[a-fA-F0-9]'

const isuu =s=> {
  if (typeof(s) != 'string') return false
  return !!s.match(`^${hex}{8}-(${hex}{4}-){3}${hex}{12}$`)
}


module.exports = { isuu }
