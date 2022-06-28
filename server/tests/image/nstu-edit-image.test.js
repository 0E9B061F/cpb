'use strict'

process.env.NODE_ENV = "test"


const request = require('supertest')
const fs = require('fs-extra')
const { db, app, CPB } = require('../../server.js')
const {
  expectLogout, expectLogin, expectMissing, expectInput, expectUnauthorized,
  expectUnallowed, expectOtherUser, expectSelfUser, expectInvalid, resetdb,
  expectImage, expectEmptyTemp, expectUploads, expectOk,
} = require('../../lib/testing.js')


beforeEach(resetdb(db, true))

afterEach(async()=> {
  await fs.remove(CPB.rc.uploads.path)
  await fs.remove(CPB.rc.uploads.temp)
  await fs.mkdirp(CPB.rc.uploads.path)
  await fs.mkdirp(CPB.rc.uploads.temp)
})


describe("editing image resources", ()=> {
  test("image data can be updated", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.put("/sys:api/nstu/img:foo")
    .field('type', 'image')
    .attach('image', `${__dirname}/../../../data/test.jpg`)
    await expectImage(rep)
    await expectUploads(18)
    rep = await agent.put("/sys:api/nstu/img:foo")
    .field('type', 'image')
    .attach('image', `${__dirname}/../../../data/skiff.png`)
    await expectImage(rep)
    await expectUploads(24)
  })
  test("images can be moved", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.get("/sys:api/nstu/img:foo")
    await expectImage(rep)
    const u = rep.body.val.resource.uuid
    const rel = rep.body.val.image.rel

    rep = await agent.put("/sys:api/nstu/img:foo")
    .send({type: 'image', title: 'baz'})
    await expectImage(rep)
    rep = await agent.get("/sys:api/nstu/img:baz")
    await expectImage(rep)
    expect(rep.body.val.resource.uuid).toBe(u)
    expect(rep.body.val.image.rel).toBe(rel)

    rep = await agent.put("/sys:api/nstu/img:baz")
    .send({type: 'image', namespace: 'any', title: 'where'})
    await expectImage(rep)
    rep = await agent.get("/sys:api/nstu/any:where")
    await expectImage(rep)
    expect(rep.body.val.resource.uuid).toBe(u)
    expect(rep.body.val.image.rel).toBe(rel)

    rep = await agent.get("/sys:api/nstu/img:foo")
    await expectMissing(rep)
    rep = await agent.get("/sys:api/nstu/img:baz")
    await expectMissing(rep)
    await expectUploads(12)
  })
  test("images cannot be moved over existing resource", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.put("/sys:api/nstu/img:foo")
    .send({type: 'image', namespace: 'main', title: 'Home'})
    await expectInvalid(rep)
    rep = await agent.put("/sys:api/nstu/img:foo")
    .send({type: 'image', namespace: 'img', title: 'bar'})
    await expectInvalid(rep)
    rep = await agent.get("/sys:api/nstu/img:foo")
    await expectImage(rep)
    await expectUploads(12)
  })
  test("images cannot be moved to invalid locations", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.put("/sys:api/nstu/img:foo")
    .send({type: 'image', namespace: '~image', title: ''})
    await expectInvalid(rep)
    rep = await agent.put("/sys:api/nstu/img:foo")
    .send({type: 'image', namespace: 'somewhere', title: ''})
    await expectInvalid(rep)
    rep = await agent.put("/sys:api/nstu/img:foo")
    .send({type: 'image', namespace: '', title: ''})
    await expectInvalid(rep)
    rep = await agent.get("/sys:api/nstu/img:foo")
    await expectImage(rep)
    await expectUploads(12)
  })
  test("image source can be edited", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.put("/sys:api/nstu/img:foo")
    .send({type: 'image', source: 'neat image'})
    await expectImage(rep)
    await expectUploads(12)
    rep = await agent.get("/sys:api/nstu/img:foo")
    await expectImage(rep)
    expect(rep.body.val.source).toBe('neat image')
  })
  test("non-image edits preserve existing image data", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.get("/sys:api/nstu/img:foo")
    await expectImage(rep)
    const oldrel = rep.body.val.image.rel
    rep = await agent.put("/sys:api/nstu/img:foo")
    .field('type', 'image')
    .field('source', 'foo!')
    await expectImage(rep)
    await expectUploads(12)
    expect(oldrel).toBe(rep.body.val.image.rel)
  })

  test("user must be logged in", async()=> {
    const agent = request.agent(app)
    // update image data
    let rep = await agent.put("/sys:api/nstu/img:foo")
    .field('type', 'image')
    .attach('image', `${__dirname}/../../../data/test.jpg`)
    await expectUnauthorized(rep)
    await expectUploads(12)
    // move image
    rep = await agent.put("/sys:api/nstu/img:foo")
    .send({type: 'image', title: 'baz'})
    await expectUnauthorized(rep)
    rep = await agent.get("/sys:api/nstu/img:foo")
    await expectImage(rep)
    // update page
    rep = await agent.put("/sys:api/nstu/img:foo")
    .send({type: 'image', source: 'neat image'})
    await expectUnauthorized(rep)
  })
})
