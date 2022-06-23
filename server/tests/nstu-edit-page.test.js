'use strict'

process.env.NODE_ENV = "test"


const request = require('supertest')
const fs = require('fs-extra')
const { db, app, CPB } = require('../server.js')
const {
  expectLogout, expectLogin, expectMissing, expectInput, expectUnauthorized,
  expectUnallowed, expectOtherUser, expectSelfUser, expectInvalid, resetdb,
  expectImage, expectEmptyTemp, expectUploads, expectOk, expectPage,
} = require('../lib/testing.js')


beforeEach(resetdb(db))


describe("editing page resources", ()=> {
  test("page source can be edited", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.put("/sys:api/nstu/main:Home")
    .send({type: 'page', source: 'new start'})
    await expectPage(rep)
    rep = await agent.get("/sys:api/nstu/main:Home")
    await expectPage(rep)
    expect(rep.body.val.source).toBe('new start')
  })
  test("pages can be moved", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.put("/sys:api/nstu/main:Home")
    .send({type: 'page', title: 'golgotha'})
    await expectPage(rep)
    rep = await agent.get("/sys:api/nstu/main:golgotha")
    await expectPage(rep)
    rep = await agent.put("/sys:api/nstu/main:golgotha")
    .send({type: 'page', namespace: 'testing', title: 'sheol'})
    await expectPage(rep)
    rep = await agent.get("/sys:api/nstu/testing:sheol")
    await expectPage(rep)
  })
  test("pages cannot be moved over existing resource", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.put("/sys:api/nstu/main:Home")
    .send({type: 'page', namespace: 'docs', title: 'WMD'})
    await expectInvalid(rep)
    rep = await agent.get("/sys:api/nstu/main:Home")
    await expectPage(rep)
  })
  test("pages cannot be moved to invalid locations", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.put("/sys:api/nstu/main:Home")
    .send({type: 'page', namespace: 'testing:', title: ''})
    await expectInvalid(rep)
    rep = await agent.get("/sys:api/nstu/main:Home")
    await expectPage(rep)

    rep = await agent.put("/sys:api/nstu/main:Home")
    .send({type: 'page', namespace: '~testing', title: ''})
    await expectInvalid(rep)
    rep = await agent.get("/sys:api/nstu/main:Home")
    await expectPage(rep)

    rep = await agent.put("/sys:api/nstu/main:Home")
    .send({type: 'page', namespace: '', title: ''})
    await expectInvalid(rep)
    rep = await agent.get("/sys:api/nstu/main:Home")
    await expectPage(rep)

    rep = await agent.put("/sys:api/nstu/main:Home")
    .send({type: 'page', namespace: '', title: 'foo'})
    await expectInvalid(rep)
    rep = await agent.get("/sys:api/nstu/main:Home")
    await expectPage(rep)
  })
  test("user must be logged in", async()=> {
    const agent = request.agent(app)
    // update image data
    let rep = await agent.put("/sys:api/nstu/main:Home")
    .send({type: 'page', source: 'new start'})
    await expectUnauthorized(rep)
    // move image
    rep = await agent.put("/sys:api/nstu/main:Home")
    .send({type: 'page', title: 'golgotha'})
    await expectUnauthorized(rep)
  })
})
