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


beforeEach(resetdb(db, false, async()=> {
  await fs.remove(CPB.rc.uploads.path)
  await fs.remove(CPB.rc.uploads.temp)
  await fs.mkdirp(CPB.rc.uploads.path)
  await fs.mkdirp(CPB.rc.uploads.temp)
}))


describe("creating image resources", ()=> {
  test("users can upload images", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.post("/sys:api/nstu/img:test")
    .field('type', 'image')
    .field('source', 'test')
    .attach('image', `${__dirname}/../../../data/test.jpg`)
    console.log('foo')
    await expectImage(rep)
    await expectEmptyTemp()
    await expectUploads(6)
  })
  test("requires login", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/img:test")
    .field('type', 'image')
    .field('source', 'test')
    .attach('image', `${__dirname}/../../../data/test.jpg`)
    await expectUnauthorized(rep)
    await expectEmptyTemp()
    await expectUploads(0)
  })
  test("cannot be posted to namespaces (including userspaces)", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    expectLogin(rep, 'qibly')
    rep = await agent.post("/sys:api/nstu/xxx:")
    .field('type', 'image')
    .field('source', 'test')
    .attach('image', `${__dirname}/../../../data/test.jpg`)
    await expectInvalid(rep)
    await expectEmptyTemp()
    await expectUploads(0)
    rep = await agent.post("/sys:api/nstu/~skiff")
    .field('type', 'image')
    .field('source', 'test')
    .attach('image', `${__dirname}/../../../data/skiff.png`)
    await expectInvalid(rep)
    await expectEmptyTemp()
    await expectUploads(0)
  })
  test("cannot be posted to occupied spaces", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.post("/sys:api/nstu/main:Home")
    .field('type', 'image')
    .field('source', 'test')
    .attach('image', `${__dirname}/../../../data/test.jpg`)
    await expectInvalid(rep)
    await expectEmptyTemp()
    await expectUploads(0)
  })
  test("requires an image", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.post("/sys:api/nstu/img:test")
    .field('type', 'image')
    .field('source', 'test')
    await expectInput(rep)
  })
  test("upload must be an image", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.post("/sys:api/nstu/img:test")
    .field('type', 'image')
    .field('source', 'test')
    .attach('image', `${__dirname}/../../../data/Home.wmd`)
    await expectInput(rep)
    await expectEmptyTemp()
    await expectUploads(0)
  })
  test("accepts only one file", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.post("/sys:api/nstu/img:test")
    .field('type', 'image')
    .field('source', 'test')
    .attach('image', `${__dirname}/../../../data/test.jpg`)
    .attach('image', `${__dirname}/../../../data/skiff.png`)
    await expectInput(rep)
    await expectEmptyTemp()
    await expectUploads(0)
  })
  test("image must not be larger than 12MiB", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.post("/sys:api/nstu/img:test")
    .field('type', 'image')
    .field('source', 'test')
    .attach('image', `${__dirname}/../../../data/big.jpg`)
    await expectInput(rep)
    await expectEmptyTemp()
    await expectUploads(0)
  })
})