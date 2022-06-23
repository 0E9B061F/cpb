'use strict'

const fs = require('fs')
const pathlib = require('path')
const { mkuser, mkpage, mkimage, getusers } = require('../lib/seeders.js')
const CPB = require('../lib/cpb.js')

const homedata = fs.readFileSync('./data/Home.wmd', {encoding: 'utf-8'})
const wmddata = fs.readFileSync('./data/WMD.wmd', {encoding: 'utf-8'})

const expectDirCount =async(path, c)=> {
  const items = await fs.promises.readdir(path)
  expect(items.length).toBe(c)
}

const expectEmptyTemp =async()=> {
  await expectDirCount(CPB.rc.uploads.temp, 0)
}
const expectUploads =async(n)=> {
  await expectDirCount(CPB.rc.uploads.path, n)
}

const expectHistory =async(rep, opt, ex)=> {
  opt = Object.assign({}, CPB.rc.listDefaults, opt, ex)
  expect(rep.statusCode).toBe(200)
  expect(rep.body.err).toBe(0)
  expect(rep.body.type).toBe('list')
  expect(rep.body.opt).toBeDefined()
  expect(rep.body.opt.sz).toBe(opt.sz)
  expect(rep.body.opt.pg).toBe(opt.pg)
  expect(rep.body.opt.ct).toBe(opt.ct)
  expect(rep.body.opt.pp).toBe(Math.ceil(opt.ct / opt.sz))
  const exlen = opt.sz > opt.ct ? opt.ct : opt.sz
  expect(rep.body.val.length).toBe(exlen)
  rep.body.val.forEach(r=> expectShort(r))
}

const expectListing =async(rep, opt, ex)=> {
  opt = Object.assign({}, CPB.rc.searchDefaults, opt, ex)
  expect(rep.statusCode).toBe(200)
  expect(rep.body.err).toBe(0)
  expect(rep.body.type).toBe('list')
  expect(rep.body.opt).toBeDefined()
  expect(rep.body.opt.sz).toBe(opt.sz)
  expect(rep.body.opt.pg).toBe(opt.pg)
  expect(rep.body.opt.ct).toBe(opt.ct)
  expect(rep.body.opt.pp).toBe(Math.ceil(opt.ct / opt.sz))
  expect(rep.body.opt.inf).toBe(opt.inf)
  expect(rep.body.opt.type).toBe(opt.type)
  const exlen = opt.sz > opt.ct ? opt.ct : opt.sz
  expect(rep.body.val.length).toBe(opt.length || exlen)
  rep.body.val.forEach(r=> expectResult(r))
}

const expectShort =val=> {
  expect(val.uuid).toBeDefined()
  expect(val.number).toBeDefined()
  expect(val.editor).toBeDefined()
  expect(val.namespace).toBeDefined()
  expect(val.views).toBeDefined()
  expect(val.createdAt).toBeDefined()
  expect(val.source).toBeUndefined()
  expect(val.resource).toBeUndefined()
  expect(val.user?.hash).toBeUndefined()
  expect(val.user?.email).toBeUndefined()
}

const expectResult =val=> {
  expect(val.uuid).toBeDefined()
  expect(val.number).toBeDefined()
  expect(val.editor).toBeDefined()
  expect(val.namespace).toBeDefined()
  expect(val.views).toBeDefined()
  expect(val.createdAt).toBeDefined()
  expect(val.source).toBeUndefined()
  expect(val.resource).toBeDefined()
  expect(val.search).toBeDefined()
  expect(val.search.source).toBeDefined()
  expect(val.user?.hash).toBeUndefined()
  expect(val.user?.email).toBeUndefined()
}

const expectVersion =async(rep)=> {
  expect(rep.statusCode).toBe(200)
  expect(rep.body.err).toBe(0)
  expect(rep.body.type).toBe('item')
  expect(rep.body.val.uuid).toBeDefined()
  expect(rep.body.val.number).toBeDefined()
  expect(rep.body.val.editor).toBeDefined()
  expect(rep.body.val.namespace).toBeDefined()
  expect(rep.body.val.source).toBeDefined()
  expect(rep.body.val.views).toBeDefined()
  expect(rep.body.val.createdAt).toBeDefined()
  expect(rep.body.val.resource).toBeDefined()
  expect(rep.body.val.resource.uuid).toBeDefined()
  expect(rep.body.val.resource.type).toBeDefined()
  expect(rep.body.val.resource.creator).toBeDefined()
  expect(rep.body.val.resource.trashed).toBeDefined()
  expect(rep.body.val.resource.trashable).toBeDefined()
  expect(rep.body.val.resource.movable).toBeDefined()
  expect(rep.body.val.resource.editable).toBeDefined()
  expect(rep.body.val.resource.views).toBeDefined()
  expect(rep.body.val.resource.createdAt).toBeDefined()
}

const expectPage =async(rep)=> {
  await expectVersion(rep)
  expect(rep.body.val.image).toBeUndefined()
  expect(rep.body.val.user).toBeUndefined()
}

const expectImage =async(rep)=> {
  await expectVersion(rep)
  expect(rep.body.val.resource.type).toBe('image')
  expect(rep.body.val.user).toBeUndefined()
  expect(rep.body.val.image).toBeDefined()
  expect(rep.body.val.image.thumbnails).toBeDefined()
  expect(rep.body.val.image.thumbnails.length).toBe(5)
  expect(rep.body.val.image.rel).toBeDefined()
  expect(rep.body.val.image.x).toBeDefined()
  expect(rep.body.val.image.y).toBeDefined()
  expect(rep.body.val.image.size).toBeDefined()
  expect(rep.body.val.image.path).toBeUndefined()
  const rels = [rep.body.val.image.rel]
  rep.body.val.image.thumbnails.forEach(t=> {
    expect(t.rel).toBeDefined()
    expect(t.x).toBeDefined()
    expect(t.y).toBeDefined()
    expect(t.size).toBeDefined()
    expect(t.thumb).toBeDefined()
    expect(t.path).toBeUndefined()
    rels.push(t.rel)
  })
  for (let n = 0; n < rels.length; n++) {
    const r = rels[n]
    const b = pathlib.basename(r)
    const p = `${CPB.rc.uploads.path}/${b}`
    let a
    try {
      await fs.promises.access(p)
      a = true
    } catch (e) {
      a = false
      console.log(`CANNOT ACCESS ${p}`)
    }
    expect(a).toBe(true)
  }
}

const expectOtherUser =async(rep, h)=> {
  await expectVersion(rep)
  expect(rep.body.val.resource.type).toBe('user')
  expect(rep.body.val.user).toBeDefined()
  expect(rep.body.val.image).toBeUndefined()
  expect(rep.body.val.user.handle).toBe(h)
  expect(rep.body.val.user.hash).toBeUndefined()
  expect(rep.body.val.user.email).toBeUndefined()
  expect(rep.body.val.user.config).toBeUndefined()
  expect(rep.body.val.user.session).toBeUndefined()
}

const expectFullUser =async(rep, h, e=null)=> {
  await expectVersion(rep)
  expect(rep.body.val.resource.type).toBe('user')
  expect(rep.body.val.user).toBeDefined()
  expect(rep.body.val.image).toBeUndefined()
  expect(rep.body.val.user.handle).toBe(h)
  if (e) expect(rep.body.val.user.email).toBe(e)
  else expect(rep.body.val.user.email).toBeDefined()
  expect(rep.body.val.user.config).toBeDefined()
  expect(rep.body.val.user.hash).toBeUndefined()
  expect(rep.body.val.user.session).toBeDefined()
  expect(rep.body.val.user.session.handle).toBe(h)
  expect(rep.body.val.user.session.login).toBe(true)
}

const expectSelfUser =async(rep, h, e)=> {
  if (!e) throw new Error('requires email')
  await expectFullUser(rep, h, e)
}

const expectError =async(rep, e, d)=> {
  expect(rep.statusCode).toBe(200)
  expect(rep.body.err).toBe(e)
  expect(rep.body.val).toBeUndefined()
  if (d) {
    expect(rep.body.details).toBeDefined()
    expect(rep.body.details.length).toBe(d)
  } else {
    expect(rep.body.details).toBeUndefined()
  }
}

const expectOk =async(rep, d)=> expectError(rep, 0, d)
const expectMissing =async(rep, d)=> expectError(rep, 1, d)
const expectUnauthorized =async(rep, d)=> expectError(rep, 2, d)
const expectInvalid =async(rep, d)=> expectError(rep, 3, d)
const expectInput =async(rep, d)=> expectError(rep, 5, d)
const expectUnallowed =async(rep, d)=> expectError(rep, 7, d)

const expectLogout =async(rep)=> {
  await expectVersion(rep)
  expect(rep.body.val.resource.type).toBe('user')
  expect(rep.body.val.user).toBeDefined()
  expect(rep.body.val.image).toBeUndefined()
  expect(rep.body.val.user.handle).toBe('guest')
  expect(rep.body.val.user.email).toBeUndefined()
  expect(rep.body.val.user.config).toBeDefined()
  expect(rep.body.val.user.hash).toBeUndefined()
  expect(rep.body.val.user.session).toBeDefined()
  expect(rep.body.val.user.session.handle).toBe('guest')
  expect(rep.body.val.user.session.login).toBe(false)
}

const expectLogin =async(rep, h)=> {
  await expectFullUser(rep, h)
}

const resetdb =(db, images, after)=> {
  return async()=> {
    await db.sequelize.sync({force: true})
    await mkuser(db.sequelize.queryInterface, [
      { handle: 'system' },
      { handle: 'guest' },
      { handle: 'root',
        email: 'root@example.com',
        pw: 'axiomatic',
        special: true,
      },
      { handle: 'qibly',
        email: 'qibly@example.com',
        pw: 'axiomatic',
      },
      { handle: 'borg',
        email: 'robot@example.com',
        pw: 'axiomatic',
      },
    ])
    await mkpage(db.sequelize.queryInterface, [{
      space: 'main', title: 'Home',
      source: homedata,
    }, {
      space: 'docs', title: 'WMD',
      source: wmddata,
    }])
    if (images) {
      await mkimage(db.sequelize.queryInterface, [
        {space: 'img', title: 'foo'},
        {space: 'img', title: 'bar'}
      ])
    }
    if (after) await after()
  }
}

const seedhistory =(db, images)=> {
  return async()=> {
    const reset = resetdb(db, images)
    await reset()
    const users = await getusers(db.sequelize.queryInterface)
    // system: 1
    // root: 3
    // borg: 6
    // qibly: 10
    await mkpage(db.sequelize.queryInterface, [
      [
        { space: 'test', title: 'history', source: 'version 1',  editor: users.system },
        { space: 'test', title: 'history', source: 'version 2',  editor: users.root },
        { space: 'test', title: 'history', source: 'version 3',  editor: users.root },
        { space: 'test', title: 'history', source: 'version 4',  editor: users.borg },
        { space: 'test', title: 'history', source: 'version 5',  editor: users.qibly },
        { space: 'test', title: 'history', source: 'version 6',  editor: users.qibly },
        { space: 'test', title: 'history', source: 'version 7',  editor: users.borg },
        { space: 'test', title: 'history', source: 'version 8',  editor: users.qibly },
        { space: 'test', title: 'history', source: 'version 9',  editor: users.qibly },
        { space: 'test', title: 'history', source: 'version 10',  editor: users.qibly },

        { space: 'main', title: 'history', source: 'version 11',  editor: users.borg },
        { space: 'main', title: 'history', source: 'version 12',  editor: users.borg },
        { space: 'main', title: 'history', source: 'version 13',  editor: users.borg },
        { space: 'main', title: 'history', source: 'version 14',  editor: users.borg },
        { space: 'test', title: 'history', source: 'version 15',  editor: users.qibly },
        { space: 'test', title: 'history', source: 'version 16',  editor: users.qibly },
        { space: 'test', title: 'history', source: 'version 17',  editor: users.root },
        { space: 'test', title: 'history', source: 'version 18',  editor: users.qibly },
        { space: 'test', title: 'history', source: 'version 19',  editor: users.qibly },
        { space: 'test', title: 'history', source: 'version 20',  editor: users.qibly },
      ]
    ])
  }
}

const seedmany =(db, images)=> {
  return async()=> {
    const reset = resetdb(db, images)
    await reset()
    // foo: 20
    // bar: 20
    // baz: 15
    // bat: 10
    await mkpage(db.sequelize.queryInterface, [
      { space: 'test', title: 'page 1', source: 'item 1 foo' },
      { space: 'test', title: 'page 2', source: 'item 2 foo' },
      { space: 'test', title: 'page 3', source: 'item 3 foo' },
      { space: 'test', title: 'page 4', source: 'item 4 foo' },
      { space: 'test', title: 'page 5', source: 'item 5 foo' },
      { space: 'test', title: 'page 6', source: 'item 6 bar' },
      { space: 'test', title: 'page 7', source: 'item 7 bar' },
      { space: 'test', title: 'page 8', source: 'item 8 bar' },
      { space: 'test', title: 'page 9', source: 'item 9 bar' },
      { space: 'test', title: 'page 10', source: 'item 10 bar' },

      { space: 'test', title: 'page 11', source: 'item 11 foo bar' },
      { space: 'test', title: 'page 12', source: 'item 12 foo bar' },
      { space: 'test', title: 'page 13', source: 'item 13 foo bar' },
      { space: 'test', title: 'page 14', source: 'item 14 foo bar' },
      { space: 'test', title: 'page 15', source: 'item 15 foo bar' },
      { space: 'test', title: 'page 16', source: 'item 16 baz' },
      { space: 'test', title: 'page 17', source: 'item 17 baz' },
      { space: 'test', title: 'page 18', source: 'item 18 baz' },
      { space: 'test', title: 'page 19', source: 'item 19 baz' },
      { space: 'test', title: 'page 20', source: 'item 20 baz' },

      { space: 'test', title: 'page 21', source: 'item 21 foo baz' },
      { space: 'test', title: 'page 22', source: 'item 22 foo baz' },
      { space: 'test', title: 'page 23', source: 'item 23 foo baz' },
      { space: 'test', title: 'page 24', source: 'item 24 foo baz' },
      { space: 'test', title: 'page 25', source: 'item 25 foo baz' },
      { space: 'test', title: 'page 26', source: 'item 26 bar baz' },
      { space: 'test', title: 'page 27', source: 'item 27 bar baz' },
      { space: 'test', title: 'page 28', source: 'item 28 bar baz' },
      { space: 'test', title: 'page 29', source: 'item 29 bar baz' },
      { space: 'test', title: 'page 30', source: 'item 30 bar baz' },

      { space: 'test', title: 'page 31', source: 'item 31 foo bar bat' },
      { space: 'test', title: 'page 32', source: 'item 32 foo bar bat' },
      { space: 'test', title: 'page 33', source: 'item 33 foo bar bat' },
      { space: 'test', title: 'page 34', source: 'item 34 foo bar bat' },
      { space: 'test', title: 'page 35', source: 'item 35 foo bar bat' },
      { space: 'test', title: 'page 36', source: 'item 36 bat' },
      { space: 'test', title: 'page 37', source: 'item 37 bat' },
      { space: 'test', title: 'page 38', source: 'item 38 bat' },
      { space: 'test', title: 'page 39', source: 'item 39 bat' },
      { space: 'test', title: 'page 40', source: 'item 40 bat' },

      { space: 'test', title: 'page 41', source: 'item 41' },
      { space: 'test', title: 'page 42', source: 'item 42' },
      { space: 'test', title: 'page 43', source: 'item 43' },
      { space: 'test', title: 'page 44', source: 'item 44' },
      { space: 'test', title: 'page 45', source: 'item 45' },
      { space: 'test', title: 'page 46', source: 'item 46' },
      { space: 'test', title: 'page 47', source: 'item 47' },
      { space: 'test', title: 'page 48', source: 'item 48' },
      { space: 'test', title: 'page 49', source: 'item 49' },
      { space: 'test', title: 'page 50', source: 'item 50' },

      { space: 'test', title: 'page 51', source: 'item 51' },
      { space: 'test', title: 'page 52', source: 'item 52' },
      { space: 'test', title: 'page 53', source: 'item 53' },
      { space: 'test', title: 'page 54', source: 'item 54' },
      { space: 'test', title: 'page 55', source: 'item 55' },
      { space: 'test', title: 'page 56', source: 'item 56' },
      { space: 'test', title: 'page 57', source: 'item 57' },
      { space: 'test', title: 'page 58', source: 'item 58' },
      { space: 'test', title: 'page 59', source: 'item 59' },
      { space: 'test', title: 'page 60', source: 'item 60' },

      { space: 'test', title: 'page 61', source: 'item 61' },
      { space: 'test', title: 'page 62', source: 'item 62' },
      { space: 'test', title: 'page 63', source: 'item 63' },
      { space: 'test', title: 'page 64', source: 'item 64' },
      { space: 'test', title: 'page 65', source: 'item 65' },
      { space: 'test', title: 'page 66', source: 'item 66' },
      { space: 'test', title: 'page 67', source: 'item 67' },
      { space: 'test', title: 'page 68', source: 'item 68' },
      { space: 'test', title: 'page 69', source: 'item 69' },
      { space: 'test', title: 'page 70', source: 'item 70' },

      { space: 'test', title: 'page 71', source: 'item 71' },
      { space: 'test', title: 'page 72', source: 'item 72' },
      { space: 'test', title: 'page 73', source: 'item 73' },
      { space: 'test', title: 'page 74', source: 'item 74' },
      { space: 'test', title: 'page 75', source: 'item 75' },
      { space: 'test', title: 'page 76', source: 'item 76' },
      { space: 'test', title: 'page 77', source: 'item 77' },
      { space: 'test', title: 'page 78', source: 'item 78' },
      { space: 'test', title: 'page 79', source: 'item 79' },
      { space: 'test', title: 'page 80', source: 'item 80' },

      { space: 'test', title: 'page 81', source: 'item 81' },
      { space: 'test', title: 'page 82', source: 'item 82' },
      { space: 'test', title: 'page 83', source: 'item 83' },
      { space: 'test', title: 'page 84', source: 'item 84' },
      { space: 'test', title: 'page 85', source: 'item 85' },
      { space: 'test', title: 'page 86', source: 'item 86' },
      { space: 'test', title: 'page 87', source: 'item 87' },
      { space: 'test', title: 'page 88', source: 'item 88' },
      { space: 'test', title: 'page 89', source: 'item 89' },
      { space: 'test', title: 'page 90', source: 'item 90' },

      { space: 'test', title: 'page 91', source: 'item 91' },
      { space: 'test', title: 'page 92', source: 'item 92' },
      { space: 'test', title: 'page 93', source: 'item 93' },
      { space: 'test', title: 'page 94', source: 'item 94' },
      { space: 'test', title: 'page 95', source: 'item 95' },
      { space: 'test', title: 'page 96', source: 'item 96' },
      { space: 'test', title: 'page 97', source: 'item 97' },
      { space: 'test', title: 'page 98', source: 'item 98' },
      { space: 'test', title: 'page 99', source: 'item 99' },

      [
        { space: 'test', title: 'history', source: 'item 100 version 1' },
        { space: 'test', title: 'history', source: 'item 100 version 2' },
        { space: 'test', title: 'history', source: 'item 100 version 3' },
        { space: 'test', title: 'history', source: 'item 100 version 4' },
        { space: 'test', title: 'history', source: 'item 100 version 5' },
        { space: 'test', title: 'history', source: 'item 100 version 6' },
        { space: 'test', title: 'history', source: 'item 100 version 7' },
        { space: 'test', title: 'history', source: 'item 100 version 8' },
        { space: 'test', title: 'history', source: 'item 100 version 9' },
        { space: 'test', title: 'history', source: 'item 100 version 10' },

        { space: 'test', title: 'inquiries', source: 'item 100 version 11' },
        { space: 'test', title: 'inquiries', source: 'item 100 version 12' },
        { space: 'test', title: 'inquiries', source: 'item 100 version 13' },
        { space: 'test', title: 'inquiries', source: 'item 100 version 14' },
        { space: 'test', title: 'history', source: 'item 100 version 15' },
        { space: 'test', title: 'history', source: 'item 100 version 16' },
        { space: 'test', title: 'history', source: 'item 100 version 17' },
        { space: 'test', title: 'history', source: 'item 100 version 18' },
        { space: 'test', title: 'history', source: 'item 100 version 19' },
        { space: 'test', title: 'page 100', source: 'item 100 version 20' },
      ]
    ])
  }
}


module.exports = {
  expectLogout, expectLogin,
  expectMissing, expectInput, expectInvalid, expectUnauthorized, expectUnallowed,
  expectOtherUser, expectSelfUser, expectEmptyTemp, expectUploads, expectOk,
  expectImage, expectPage, expectListing, expectHistory,
  resetdb, seedhistory, seedmany,
}
