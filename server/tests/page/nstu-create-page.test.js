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


describe("creating page resources", ()=> {
  test("users can create pages", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.post("/sys:api/nstu/testing:Home")
    .send({type: 'page', source: 'hello friends'})
    await expectPage(rep)
    expect(rep.body.val.source).toBe('hello friends')
  })
  test("requires login", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/testing:Home")
    .send({type: 'page', source: 'hello friends'})
    expectUnauthorized(rep)
    rep = await agent.get("/sys:api/nstu/testing:Home")
    expectMissing(rep)
  })
  test("cannot be posted to namespaces (including userspaces)", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.post("/sys:api/nstu/testing:")
    .send({type: 'page', source: 'hello friends'})
    await expectInvalid(rep)
    rep = await agent.get("/sys:api/nstu/testing:")
    expectMissing(rep)

    rep = await agent.post("/sys:api/nstu/~testing")
    .send({type: 'page', source: 'hello friends'})
    await expectInvalid(rep)
    rep = await agent.get("/sys:api/nstu/~testing")
    expectMissing(rep)

    rep = await agent.post("/sys:api/nstu/")
    .send({type: 'page', source: 'hello friends'})
    await expectInvalid(rep)
    rep = await agent.get("/sys:api/nstu/~testing")
    expectMissing(rep)
  })
  test("cannot be posted to occupied spaces", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    rep = await agent.post("/sys:api/nstu/main:Home")
    .send({type: 'page', source: 'hello friends'})
    await expectInvalid(rep)
  })
})
