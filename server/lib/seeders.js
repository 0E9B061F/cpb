'use strict'

const fs = require('fs')
const pathlib = require('path')
const { v4 } = require ('uuid')
const { sample } = require('../../lib/util.js')
const bcrypt = require('bcrypt')
const util = require('./util.js')
const CPB = require('./cpb.js')
const WMD = require('./analyzer.js')
const { CPBImage } = require('./cpbimage.js')

const images = [
  { path: 'data/simple-1.png', mime: 'image/png' },
  { path: 'data/simple-2.png', mime: 'image/png' },
]

const insertImage =async(i, t, u)=> {
  const ext = util.extmap[i.mime]
  u = u.toUpperCase()
  const target = `${t}/${u}.${ext}`
  const p = pathlib.resolve(i.path)
  await fs.promises.copyFile(p, target)
  return target
}

const blank =t=> {
  return {
    uuid: v4(),
    createdAt: t,
    updatedAt: t,
  }
}

const getusers =async(qi)=> {
  let users = await qi.sequelize.query(
    `SELECT uuid, handle from USERS;`
  )
  const out = {}
  users[0].forEach(u=> {
    out[u.handle] = u.uuid
  })
  return out
}

const mkpage = async (qi, confs, users)=> {
  if (!users) {
    let system = await qi.sequelize.query(
      `SELECT uuid from USERS where handle="system";`
    )
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
    if (!Array.isArray(versions)) versions = [versions]
    const resourceSet = blank(time)
    if (versions[0].editor) {
      resourceSet.creatorUuid = versions[0].editor
    } else {
      resourceSet.creatorUuid = sample(users)
    }
    resourceSet.type = 'page'
    sets.resources.push(resourceSet)
    let lastver
    for (let i = 0; i < versions.length; i++) {
      const conf = versions[i]
      const versionSet = blank(time)
      const pageSet = blank(time)
      if (conf.editor) {
        versionSet.editorUuid = conf.editor
      } else {
        versionSet.editorUuid = sample(users)
      }
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
      const doc = new WMD(versionSet.source)
      versionSet.text = doc.allText.text
      versionSet.lede = doc.lede.raw
      versionSet.wordCount = doc.wordCount
      lastver = versionSet
      sets.versions.push(versionSet)
      sets.pages.push(pageSet)
    }
  }
  await qi.bulkInsert('Resources', sets.resources)
  await qi.bulkInsert('Pages', sets.pages)
  return qi.bulkInsert('Versions', sets.versions)
}

const mkimage = async (qi, confs, users)=> {
  if (!users) {
    let system = await qi.sequelize.query(
      `SELECT uuid from USERS where handle="system";`
    )
    system = system[0][0]
    users = [system.uuid]
  }
  const time = new Date()
  const sets = {
    resources: [],
    versions: [],
    images: [],
    thumbs: [],
  }
  for (let n = 0; n < confs.length; n++) {
    let versions = confs[n]
    const resourceSet = blank(time)
    resourceSet.creatorUuid = sample(users)
    resourceSet.type = 'image'
    sets.resources.push(resourceSet)
    if (!Array.isArray(versions)) versions = [versions]
    let lastver
    for (let i = 0; i < versions.length; i++) {
      const conf = versions[i]
      const versionSet = blank(time)
      const imageSet = blank(time)

      const origin = sample(images)
      const imgpath = await insertImage(origin, CPB.rc.uploads.path, imageSet.uuid)
      const img = new CPBImage(imgpath)
      await img.prep()

      versionSet.editorUuid = sample(users)
      versionSet.number = i + 1
      if (lastver) {
        lastver.nextUuid = versionSet.uuid
        versionSet.prevUuid = lastver.uuid
      }
      versionSet.resourceUuid = resourceSet.uuid
      versionSet.namespace = conf.space
      versionSet.title = conf.title
      if (conf.source) versionSet.source = conf.source
      else versionSet.source = ''
      const doc = new WMD(versionSet.source)
      versionSet.text = doc.allText.text
      versionSet.lede = doc.lede.raw
      versionSet.wordCount = doc.wordCount
      versionSet.imageUuid = imageSet.uuid

      imageSet.resourceUuid = resourceSet.uuid
      imageSet.path = img.path
      imageSet.x = img.x
      imageSet.y = img.y
      imageSet.size = img.size
      imageSet.mime = origin.mime

      img.thumbinfo().forEach(t=> {
        const thumbSet = blank(time)
        thumbSet.imageUuid = imageSet.uuid
        thumbSet.path = t.path
        thumbSet.x = t.x
        thumbSet.y = t.y
        thumbSet.size = t.size
        thumbSet.thumb = t.thumb
        sets.thumbs.push(thumbSet)
      })

      lastver = versionSet
      sets.versions.push(versionSet)
      sets.images.push(imageSet)
    }
  }
  await qi.bulkInsert('Resources', sets.resources)
  await qi.bulkInsert('Images', sets.images)
  await qi.bulkInsert('Thumbnails', sets.thumbs)
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
    if (conf.source) versionSet.source = conf.source
    else versionSet.source = ''
    const doc = new WMD(versionSet.source)
    versionSet.text = doc.allText.text
    versionSet.lede = doc.lede.raw
    versionSet.wordCount = doc.wordCount
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
  await qi.bulkInsert('Configs', sets.configs)
  await qi.bulkInsert('Users', sets.users)
  await qi.bulkInsert('Resources', sets.resources)
  await qi.bulkInsert('Versions', sets.versions)
  return sets.users.map(u=> u.uuid)
}


module.exports = { mkpage, mkpages, multiconf, mkuser, mkimage, getusers }
