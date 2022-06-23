'use strict'

process.env.NODE_ENV = "test"


const request = require('supertest')
const { db, app } = require('../server.js')
const {
  expectLogout, expectLogin, expectMissing, expectInput, expectUnauthorized,
  expectUnallowed, expectOtherUser, expectSelfUser, expectInvalid, resetdb,
  expectImage, expectEmptyTemp, expectUploads, expectOk,
} = require('../lib/testing.js')


beforeEach(resetdb(db))


describe("editing user resources", ()=> {
  test("users can be renamed", async()=> {
    const agent = request.agent(app)
    await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    let rep = await agent.put("/sys:api/nstu/~qibly").send({type: 'user', namespace: '~bartlet', confirmation: 'axiomatic'})
    await expectLogin(rep, 'bartlet')
    rep = await agent.get("/sys:api/nstu/~bartlet")
    await expectLogin(rep, 'bartlet')
    rep = await agent.get("/sys:api/nstu/~qibly")
    await expectMissing(rep)

    rep = await agent.put("/sys:api/nstu/~bartlet").send({type: 'user', handle: 'caleb', confirmation: 'axiomatic'})
    await expectLogin(rep, 'caleb')
    rep = await agent.get("/sys:api/nstu/~caleb")
    await expectLogin(rep, 'caleb')
    rep = await agent.get("/sys:api/nstu/~bartlet")
    await expectMissing(rep)
  })
  test("cannot be renamed to an existing user", async()=> {
    const agent = request.agent(app)
    await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    let rep = await agent.put("/sys:api/nstu/~qibly").send({type: 'user', namespace: '~root', confirmation: 'axiomatic'})
    await expectInvalid(rep)
    rep = await agent.get("/sys:api/nstu/~qibly")
    await expectLogin(rep, 'qibly')

    rep = await agent.put("/sys:api/nstu/~qibly").send({type: 'user', handle: 'system', confirmation: 'axiomatic'})
    await expectInvalid(rep)
    rep = await agent.get("/sys:api/nstu/~qibly")
    await expectLogin(rep, 'qibly')
  })
  test("cannot be given a reserved name", async()=> {
    const agent = request.agent(app)
    await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    let rep = await agent.put("/sys:api/nstu/~qibly").send({type: 'user', namespace: '~deletedguy', confirmation: 'axiomatic'})
    await expectInvalid(rep)
    rep = await agent.get("/sys:api/nstu/~qibly")
    await expectLogin(rep, 'qibly')

    rep = await agent.put("/sys:api/nstu/~qibly").send({type: 'user', handle: 'deleted-007', confirmation: 'axiomatic'})
    await expectInvalid(rep)
    rep = await agent.get("/sys:api/nstu/~qibly")
    await expectLogin(rep, 'qibly')
  })
  test("users can change their email", async()=> {
    const agent = request.agent(app)
    await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    let rep = await agent.put("/sys:api/nstu/~qibly").send({type: 'user', email: 'ghost@mail.com', confirmation: 'axiomatic'})
    await expectSelfUser(rep, 'qibly', 'ghost@mail.com')
    rep = await agent.get("/sys:api/nstu/~")
    await expectSelfUser(rep, 'qibly', 'ghost@mail.com')
  })
  test("users can change their password", async()=> {
    const agent = request.agent(app)
    await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    let rep = await agent.put("/sys:api/nstu/~qibly").send({type: 'user', pass: 'NEWAXIOM', confirmation: 'axiomatic'})
    await expectLogin(rep, 'qibly')
    await agent.post("/sys:api/nstu/~").send({type: 'logout'})
    rep = await agent.get("/sys:api/nstu/~")
    await expectLogout(rep)
    rep = await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'NEWAXIOM'})
    await expectLogin(rep, 'qibly')
  })
  test("users can edit their user page", async()=> {
    const agent = request.agent(app)
    await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    let rep = await agent.put("/sys:api/nstu/~qibly").send({type: 'user', source: 'NEW AXIOM!'})
    await expectLogin(rep, 'qibly')
    expect(rep.body.val.source).toBe('NEW AXIOM!')
  })
  test("users can edit their config", async()=> {
    const agent = request.agent(app)
    await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    let rep = await agent.put("/sys:api/nstu/~qibly").send({type: 'user', confAutodark: false, confDebug: true})
    await expectLogin(rep, 'qibly')
    expect(rep.body.val.user.config.autodark).toBe(false)
    expect(rep.body.val.user.config.debug).toBe(true)
  })
  test("user resources are private, and cannot be edited by others", async()=> {
    const agent = request.agent(app)
    // cannot edit config
    await agent.post("/sys:api/nstu/~qibly").send({type: 'login', pass: 'axiomatic'})
    let rep = await agent.put("/sys:api/nstu/~borg").send({type: 'user', confAutodark: false, confDebug: true})
    await expectUnauthorized(rep)
    // cannot edit page
    rep = await agent.put("/sys:api/nstu/~borg").send({type: 'user', source: 'NEW AXIOM!'})
    await expectUnauthorized(rep)
    // cannot edit password
    rep = await agent.put("/sys:api/nstu/~borg").send({type: 'user', pass: 'NEWAXIOM', confirmation: 'axiomatic'})
    await expectUnauthorized(rep)
    // cannot edit email
    rep = await agent.put("/sys:api/nstu/~borg").send({type: 'user', email: 'ghost@mail.com', confirmation: 'axiomatic'})
    await expectUnauthorized(rep)
    // cannot rename
    rep = await agent.put("/sys:api/nstu/~borg").send({type: 'user', namespace: '~bartlet', confirmation: 'axiomatic'})
    await expectUnauthorized(rep)
  })
  test("user resources cannot be edited by guest", async()=> {
    const agent = request.agent(app)
    // cannot edit config
    let rep = await agent.put("/sys:api/nstu/~borg").send({type: 'user', confAutodark: false, confDebug: true})
    await expectUnauthorized(rep)
    // cannot edit page
    rep = await agent.put("/sys:api/nstu/~borg").send({type: 'user', source: 'NEW AXIOM!'})
    await expectUnauthorized(rep)
    // cannot edit password
    rep = await agent.put("/sys:api/nstu/~borg").send({type: 'user', pass: 'NEWAXIOM', confirmation: 'axiomatic'})
    await expectUnauthorized(rep)
    // cannot edit email
    rep = await agent.put("/sys:api/nstu/~borg").send({type: 'user', email: 'ghost@mail.com', confirmation: 'axiomatic'})
    await expectUnauthorized(rep)
    // cannot rename
    rep = await agent.put("/sys:api/nstu/~borg").send({type: 'user', namespace: '~bartlet', confirmation: 'axiomatic'})
    await expectUnauthorized(rep)
  })
})
