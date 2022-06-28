'use strict'

process.env.NODE_ENV = "test"


const request = require('supertest')
const fs = require('fs-extra')
const { db, app, CPB } = require('../../server.js')
const {
  expectLogout, expectLogin, expectMissing, expectInput, expectUnauthorized,
  expectUnallowed, expectOtherUser, expectSelfUser, expectInvalid, resetdb,
  expectImage, expectEmptyTemp, expectUploads, expectOk, expectPage,
} = require('../../lib/testing.js')


beforeEach(resetdb(db))


describe("trashing page resources", ()=> {
  test("pages can be trashed", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.delete("/sys:api/nstu/main:Home?mode=trash")
    await expectOk(rep)
    rep = await agent.get("/sys:api/nstu/main:Home")
    await expectMissing(rep)
  })
  test("pages can be destroyed", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.delete("/sys:api/nstu/main:Home?mode=trash")
    await expectOk(rep)
    rep = await agent.delete("/sys:api/nstu/main:Home")
    await expectOk(rep)
  })
  test("pages must be logged in to trash images", async()=> {
    const agent = request.agent(app)
    let rep = await agent.delete("/sys:api/nstu/main:Home?mode=trash")
    await expectUnauthorized(rep)
    rep = await agent.get("/sys:api/nstu/main:Home")
    await expectPage(rep)
  })
  test("user must be logged in to destroy pages", async()=> {
    const agent = request.agent(app)
    let rep = await agent.delete("/sys:api/nstu/main:Home")
    await expectUnauthorized(rep)
    rep = await agent.get("/sys:api/nstu/main:Home")
    await expectPage(rep)
  })
})
