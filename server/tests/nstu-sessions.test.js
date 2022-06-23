'use strict'

process.env.NODE_ENV = "test"


const request = require('supertest')
const { db, app } = require('../server.js')
const { expectLogout, expectLogin, resetdb } = require('../lib/testing.js')


beforeEach(resetdb(db))


describe("session handling", ()=> {
  test("users without a login are assigned to the guest account", async()=> {
    const rep = await request(app).get("/sys:api/nstu/~")
    expectLogout(rep)
  })
  test("logging in assigns the user an account", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/~")
    expectLogout(rep)
    rep = await agent.post("/sys:api/nstu/~root").send({type: 'login', pass: 'axiomatic'})
    expectLogin(rep, 'root')
    rep = await agent.get("/sys:api/nstu/~")
    expectLogin(rep, 'root')
  })
  test("accounts without passwords cannot be logged into", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/~")
    expectLogout(rep)
    rep = await agent.post("/sys:api/nstu/~system").send({type: 'login'})
    expect(rep.statusCode).toBe(200)
    expect(rep.body.err).toBe(5)
    expect(rep.body.val).toBe(undefined)
    rep = await agent.get("/sys:api/nstu/~")
    expectLogout(rep)
    rep = await agent.post("/sys:api/nstu/~system").send({type: 'login', pass: 'foobarbaz'})
    expect(rep.statusCode).toBe(200)
    expect(rep.body.err).toBe(5)
    expect(rep.body.val).toBe(undefined)
    rep = await agent.get("/sys:api/nstu/~")
    expectLogout(rep)
  })
  test("logged-in users cannot login again", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/~")
    expectLogout(rep)
    rep = await agent.post("/sys:api/nstu/~root").send({type: 'login', pass: 'axiomatic'})
    expectLogin(rep, 'root')
    rep = await agent.post("/sys:api/nstu/~root").send({type: 'login', pass: 'axiomatic'})
    expect(rep.statusCode).toBe(200)
    expect(rep.body.err).toBe(3)
    expect(rep.body.val).toBe(undefined)
  })
  test("logging out drops the current account", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/~")
    expectLogout(rep)
    rep = await agent.post("/sys:api/nstu/~root").send({type: 'login', pass: 'axiomatic'})
    expectLogin(rep, 'root')
    rep = await agent.get("/sys:api/nstu/~")
    expectLogin(rep, 'root')
    rep = await agent.post("/sys:api/nstu/~").send({type: 'logout'})
    expect(rep.body.err).toBe(0)
    rep = await agent.get("/sys:api/nstu/~")
    expectLogout(rep)
  })
  test("logged-out users cannot logout", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/~")
    expectLogout(rep)
    rep = await agent.post("/sys:api/nstu/~").send({type: 'logout'})
    expect(rep.body.err).toBe(2)
  })
})
