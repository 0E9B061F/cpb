'use strict'

const CPB = require('./cpb.js')
const Reply = require('./reply.js')


const loggedas =h=> {
  return (req, res, next)=> {
    if (req.session.cpb.login && req.session.cpb.handle == h) next()
    else Reply.unauthorized().send(res)
  }
}

const needlogin =(req, res, next)=> {
  if (req.session.cpb.login) next()
  else Reply.unauthorized('you are not logged in').send(res)
}

const needlogout =(req, res, next)=> {
  if (!req.session.cpb.login) next()
  else Reply.invalid('you are already logged in').send(res)
}

const notsingleuser =(req, res, next)=> {
  if (!CPB.rc.singleuser) next()
  else Reply.invalid('registration disabled').send(res)
}


module.exports = {
  loggedas, needlogin, needlogout, notsingleuser,
}
