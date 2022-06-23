'use strict'

process.env.NODE_ENV = "test"


const request = require('supertest')
const { db, app } = require('../server.js')
const {
  expectLogout, expectLogin, expectMissing, expectInput, expectUnauthorized,
  expectUnallowed, expectOtherUser, expectSelfUser, expectInvalid, resetdb,
} = require('../lib/testing.js')


beforeEach(resetdb(db))


describe("creating user resources", ()=> {
  test("user must be logged out", async()=> {
    const agent = request.agent(app)
    await agent.post("/sys:api/nstu/~root").send({type: 'login', pass: 'axiomatic'})
    let rep = await agent.post("/sys:api/nstu/~TEST").send({type: 'user', pass: 'desdichado', email: 'black@knight.com'})
    await expectInvalid(rep)
  })
  test("grants a login as the created user", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~TEST").send({type: 'user', pass: 'desdichado', email: 'black@knight.com'})
    console.log(rep)
    await expectLogin(rep, 'TEST')
    rep = await agent.get("/sys:api/nstu/~")
    await expectLogin(rep, 'TEST')
  })
  test("cannot be created outside userpages", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/users:TEST")
    .send({type: 'user', pass: 'desdichado', email: 'black@knight.com'})
    await expectInvalid(rep)
    rep = await agent.post("/sys:api/nstu/xxx:")
    .send({type: 'user', pass: 'desdichado', email: 'black@knight.com'})
    await expectInvalid(rep)
  })
  test("cannot be given a reserved name", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~deleted007")
    .send({type: 'user', pass: 'desdichado', email: 'black@knight.com'})
    await expectInvalid(rep)
    rep = await agent.post("/sys:api/nstu/~deleted-0000000000000000")
    .send({type: 'user', pass: 'desdichado', email: 'black@knight.com'})
    await expectInvalid(rep)
  })
  test("handle must be correctly formed", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~x").send({type: 'user', pass: 'desdichado', email: 'black@knight.com'})
    await expectInput(rep, 1)
    rep = await agent.post("/sys:api/nstu/~xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx").send({type: 'user', pass: 'desdichado', email: 'black@knight.com'})
    await expectInput(rep, 1)
    rep = await agent.post("/sys:api/nstu/~foo$bar.baz").send({type: 'user', pass: 'desdichado', email: 'black@knight.com'})
    await expectInvalid(rep)
    rep = await agent.post("/sys:api/nstu/~.someusername").send({type: 'user', pass: 'desdichado', email: 'black@knight.com'})
    await expectInvalid(rep)
    rep = await agent.post("/sys:api/nstu/~root").send({type: 'user', pass: 'desdichado', email: 'black@knight.com'})
    await expectInvalid(rep)
  })
  test("handle must not exist", async()=> {

  })
  test("email must be correctly formed", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~TEST").send({type: 'user', pass: 'desdichado', email: 'foobarbaz'})
    await expectInput(rep, 1)
    rep = await agent.post("/sys:api/nstu/~TEST").send({type: 'user', pass: 'desdichado', email: '@site.com'})
    await expectInput(rep, 1)
    rep = await agent.post("/sys:api/nstu/~TEST").send({type: 'user', pass: 'desdichado', email: 'name@site'})
    await expectInput(rep, 1)
    rep = await agent.post("/sys:api/nstu/~TEST").send({type: 'user', pass: 'desdichado', email: ''})
    await expectInput(rep, 2)
    rep = await agent.post("/sys:api/nstu/~TEST").send({type: 'user', pass: 'desdichado'})
    await expectInput(rep, 1)
    rep = await agent.post("/sys:api/nstu/~TEST").send({type: 'user', pass: 'desdichado', email: 'root@example.com'})
    await expectInput(rep, 1)
  })
  test("password must be correctly formed", async()=> {
    const agent = request.agent(app)
    let rep = await agent.post("/sys:api/nstu/~TEST").send({type: 'user', pass: 'short', email: 'black@knight.com'})
    await expectInput(rep, 1)
    rep = await agent.post("/sys:api/nstu/~TEST").send({type: 'user', pass: '', email: 'black@knight.com'})
    await expectInput(rep, 2)
    rep = await agent.post("/sys:api/nstu/~TEST").send({type: 'user', email: 'black@knight.com'})
    await expectInput(rep, 1)
  })
  test("grants no login on errors", async()=> {
    const agent = request.agent(app)
    await agent.post("/sys:api/nstu/~TEST").send({type: 'user', pass: 'desdichado', email: 'foobarbaz'})
    let rep = await agent.get("/sys:api/nstu/~")
    await expectLogout(rep)
    await agent.post("/sys:api/nstu/users:TEST").send({type: 'user', pass: 'desdichado', email: 'black@knight.com'})
    rep = await agent.get("/sys:api/nstu/~")
    await expectLogout(rep)
    await agent.post("/sys:api/nstu/~root").send({type: 'user', pass: 'desdichado', email: 'black@knight.com'})
    rep = await agent.get("/sys:api/nstu/~")
    await expectLogout(rep)
    await agent.post("/sys:api/nstu/~TEST").send({type: 'user', pass: 'desdichado', email: 'root@example.com'})
    rep = await agent.get("/sys:api/nstu/~")
    await expectLogout(rep)
  })
})
