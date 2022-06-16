'use strict'

const { v4 } = require ('uuid')
const { sample } = require('../../lib/util.js')
const bcrypt = require('bcrypt')

const blank =t=> {
  return {
    uuid: v4(),
    createdAt: t,
    updatedAt: t,
  }
}

const mkpage = async (qi, confs, users)=> {
  console.log('making page')
  if (!users) {
    let system = await qi.sequelize.query(
      `SELECT uuid from USERS where handle="system";`
    )
    console.log(system)
    system = system[0][0]
    users = [system.uuid]
  }
  const time = new Date()
  const sets = {
    resources: [],
    versions: [],
    pages: [],
  }
  for (let n = 0; n < confs.length; n++) {
    let versions = confs[n]
    const resourceSet = blank(time)
    resourceSet.creatorUuid = sample(users)
    resourceSet.type = 'page'
    sets.resources.push(resourceSet)
    if (!Array.isArray(versions)) versions = [versions]
    let lastver
    for (let i = 0; i < versions.length; i++) {
      const conf = versions[i]
      const versionSet = blank(time)
      const pageSet = blank(time)
      versionSet.editorUuid = sample(users)
      versionSet.number = i + 1
      if (lastver) {
        lastver.nextUuid = versionSet.uuid
        versionSet.prevUuid = lastver.uuid
      }
      versionSet.pageUuid = pageSet.uuid
      pageSet.resourceUuid = resourceSet.uuid
      versionSet.resourceUuid = resourceSet.uuid
      versionSet.namespace = conf.space
      versionSet.title = conf.title
      versionSet.source = conf.source
      lastver = versionSet
      sets.versions.push(versionSet)
      sets.pages.push(pageSet)
    }
  }
  await qi.bulkInsert('Resources', sets.resources)
  await qi.bulkInsert('Pages', sets.pages)
  return qi.bulkInsert('Versions', sets.versions)
}

const multiconf =(r,v,block)=> {
  const confs = []
  const resources = [...Array(r).keys()]
  resources.forEach(n=> {
    const uni = {}
    block(uni, vblock=> {
      const vers = []
      const versions = [...Array(v).keys()]
      versions.forEach(i=> {
        const part = {}
        vblock(part)
        vers.push({...uni, ...part})
      })
      confs.push(vers)
    })
  })
  return confs
}

const mkpages = async (qi, r,v,block, users)=> {
  const confs = multiconf(r,v,block)
  return mkpage(qi, confs, users)
}

const mkuser = async (qi, confs)=> {
  const time = new Date()
  const sets = {
    resources: [],
    versions: [],
    users: [],
    configs: [],
  }
  for (let n = 0; n < confs.length; n++) {
    const conf = confs[n]
    const resourceSet = blank(time)
    const versionSet = blank(time)
    const userSet = blank(time)
    const configSet = blank(time)
    resourceSet.creatorUuid = userSet.uuid
    if (!conf.pw || conf.special) {
      resourceSet.movable = false
      resourceSet.trashable = false
      userSet.special = true
    } else {
      resourceSet.movable = true
      resourceSet.trashable = true
      userSet.special = conf.special || false
    }
    resourceSet.deletable = false
    resourceSet.private = true
    resourceSet.type = 'user'
    versionSet.editorUuid = userSet.uuid
    versionSet.userUuid = userSet.uuid
    versionSet.resourceUuid = resourceSet.uuid
    versionSet.namespace = `~${conf.handle}`
    userSet.configUuid = configSet.uuid
    userSet.handle = conf.handle
    if (conf.email) userSet.email = conf.email
    userSet.lastseen = time
    if (conf.pw) {
      userSet.hash = await bcrypt.hash(conf.pw, 10)
    }
    sets.resources.push(resourceSet)
    sets.versions.push(versionSet)
    sets.users.push(userSet)
    sets.configs.push(configSet)
  }
  console.log(sets)
  console.log('creating configs')
  await qi.bulkInsert('Configs', sets.configs)
  console.log('creating users')
  await qi.bulkInsert('Users', sets.users)
  console.log('creating resources')
  await qi.bulkInsert('Resources', sets.resources)
  console.log('creating versions')
  await qi.bulkInsert('Versions', sets.versions)
  console.log(sets)
  return sets.users.map(u=> u.uuid)
}


module.exports = { mkpage, mkpages, multiconf, mkuser }
