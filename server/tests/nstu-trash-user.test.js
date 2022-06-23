'use strict'

process.env.NODE_ENV = "test"


const request = require('supertest')
const { db, app } = require('../server.js')
const {
  expectLogout, expectLogin, expectMissing, expectInput, expectUnauthorized,
  expectUnallowed, expectOtherUser, expectSelfUser, resetdb
} = require('../lib/testing.js')


beforeEach(resetdb(db))


describe("deleting user resources", ()=> {
  test("users can trash their accounts", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    expectLogin(rep, 'qibly')
    await agent.delete("/sys:api/nstu/~qibly?mode=trash").send({pass: 'axiomatic'})
    rep = await agent.get("/sys:api/nstu/~")
    expectLogout(rep)
    rep = await agent.get("/sys:api/nstu/~qibly")
    expectMissing(rep)
    rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    expectInput(rep)
    rep = await agent.get("/sys:api/nstu/~deleted-0000000000000001")
    expectOtherUser(rep, 'deleted-0000000000000001')
  })
  test("trashing requires confirmation", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    expectLogin(rep, 'qibly')
    // no confirmation
    rep = await agent.delete("/sys:api/nstu/~qibly?mode=trash")
    expectInput(rep)
    rep = await agent.get("/sys:api/nstu/~")
    expectLogin(rep, 'qibly')
    rep = await agent.get("/sys:api/nstu/~qibly")
    expectSelfUser(rep, 'qibly', 'qibly@example.com')
    // malformed confirmation
    rep = await agent.delete("/sys:api/nstu/~qibly?mode=trash").send({pass: 'tumtumtum'})
    expectInput(rep)
    rep = await agent.get("/sys:api/nstu/~")
    expectLogin(rep, 'qibly')
    rep = await agent.get("/sys:api/nstu/~qibly")
    expectSelfUser(rep, 'qibly', 'qibly@example.com')
    // empty confirmation
    rep = await agent.delete("/sys:api/nstu/~qibly?mode=trash").send({pass: ''})
    expectInput(rep)
    rep = await agent.get("/sys:api/nstu/~")
    expectLogin(rep, 'qibly')
    rep = await agent.get("/sys:api/nstu/~qibly")
    expectSelfUser(rep, 'qibly', 'qibly@example.com')
  })
  test("users cannot trash other accounts", async()=> {
    const agent = request.agent(app)
    let rep = await agent.delete("/sys:api/nstu/~borg?mode=trash").send({pass: 'axiomatic'})
    expectUnauthorized(rep)
    rep = await agent.get("/sys:api/nstu/~")
    expectLogout(rep)
    rep = await agent.get("/sys:api/nstu/~borg")
    expectOtherUser(rep, 'borg')

    rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    expectLogin(rep, 'qibly')
    rep = await agent.delete("/sys:api/nstu/~borg?mode=trash").send({pass: 'axiomatic'})
    expectUnallowed(rep)
    rep = await agent.get("/sys:api/nstu/~")
    expectLogin(rep, 'qibly')
    rep = await agent.get("/sys:api/nstu/~borg")
    expectOtherUser(rep, 'borg')
  })
  test("users cannot be fully deleted", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    expectLogin(rep, 'qibly')
    rep = await agent.delete("/sys:api/nstu/~qibly").send({pass: 'axiomatic'})
    expectUnallowed(rep)
    rep = await agent.get("/sys:api/nstu/~qibly")
    expectLogin(rep, 'qibly')
    expectSelfUser(rep, 'qibly', 'qibly@example.com')
  })
})
