'use strict'

process.env.NODE_ENV = "test"


const request = require('supertest')
const fs = require('fs-extra')
const { db, app, CPB } = require('../server.js')
const {
  expectLogout, expectLogin, expectMissing, expectInput, expectUnauthorized,
  expectUnallowed, expectOtherUser, expectSelfUser, expectInvalid, resetdb,
  expectImage, expectEmptyTemp, expectUploads, expectOk,
} = require('../lib/testing.js')


beforeEach(resetdb(db, true))

afterEach(async()=> {
  await fs.remove(CPB.rc.uploads.path)
  await fs.remove(CPB.rc.uploads.temp)
  await fs.mkdirp(CPB.rc.uploads.path)
  await fs.mkdirp(CPB.rc.uploads.temp)
})


describe("trashing image resources", ()=> {
  test("images can be trashed", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.delete("/sys:api/nstu/img:foo?mode=trash")
    await expectOk(rep)
    rep = await agent.get("/sys:api/nstu/img:foo")
    await expectMissing(rep)
    await expectUploads(12)
  })
  test("images can be destroyed", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.delete("/sys:api/nstu/img:foo?mode=trash")
    await expectOk(rep)
    rep = await agent.delete("/sys:api/nstu/img:foo")
    await expectOk(rep)
    rep = await agent.delete("/sys:api/nstu/img:bar?mode=trash")
    await expectOk(rep)
    rep = await agent.delete("/sys:api/nstu/img:bar")
    await expectOk(rep)
    await expectUploads(0)
  })
  test("user must be logged in to trash images", async()=> {
    const agent = request.agent(app)
    let rep = await agent.delete("/sys:api/nstu/img:foo?mode=trash")
    await expectUnauthorized(rep)
    rep = await agent.get("/sys:api/nstu/img:foo")
    await expectImage(rep)
    await expectUploads(12)
  })
  test("user must be logged in to destroy images", async()=> {
    const agent = request.agent(app)
    let rep = await agent.delete("/sys:api/nstu/img:foo")
    await expectUnauthorized(rep)
    rep = await agent.get("/sys:api/nstu/img:foo")
    await expectImage(rep)
    await expectUploads(12)
  })
})
