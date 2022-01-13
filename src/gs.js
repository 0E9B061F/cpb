'use strict'


const rc = require('./rc.js')


const gs = {
  path: window.location.pathname,
  aod: 0,
}
gs.burl =()=> `${rc.proto}://${rc.domain}${rc.port ? ':'+rc.port : ''}`
gs.aurl =()=> `${gs.burl()}/${rc.apikey}`
gs.human =path=> {
  if (path == '/' || path == '') {
    return 'Home'
  } else {
    if (path[0] == '/') path = path.slice(1)
    return path.split('/').join(' > ')
  }
}
gs.rp =p=> {
  const hex = '[a-fA-F0-9]'
  if (p.match(`${hex}{8}-(${hex}{4}-){3}${hex}{12}`)) {
    return `${gs.aurl()}/uuid${p}`
  } else {
    return `${gs.aurl()}/get${p}`
  }
}
gs.cmd =(n, p='')=> `${gs.aurl()}/${n}${p}`


module.exports = gs

