'use strict'

process.env.NODE_ENV = "test"


const request = require('supertest')
const fs = require('fs-extra')
const { db, app, CPB } = require('../server.js')
const {
  expectLogout, expectLogin, expectMissing, expectInput, expectUnauthorized,
  expectUnallowed, expectOtherUser, expectSelfUser, expectInvalid, resetdb,
  expectImage, expectEmptyTemp, expectUploads, expectPage, seedhistory,
  expectHistory,
} = require('../lib/testing.js')


beforeEach(seedhistory(db, true))
afterEach(async()=> {
  await fs.remove(CPB.rc.uploads.path)
  await fs.remove(CPB.rc.uploads.temp)
  await fs.mkdirp(CPB.rc.uploads.path)
  await fs.mkdirp(CPB.rc.uploads.temp)
})

describe("getting history listings", ()=> {
  test("users can get can get histories", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/test:history?get=hist")
    expectHistory(rep, {}, {ct: 20})
    rep = await agent.get("/sys:api/nstu/~root?get=hist")
    expectHistory(rep, {}, {ct: 1})
    rep = await agent.get("/sys:api/nstu/img:foo?get=hist")
    expectHistory(rep, {}, {ct: 1})
  })
  test("options control listing output", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/test:history?get=hist&sz=5")
    expectHistory(rep, {sz: 5}, {ct: 20})
    rep = await agent.get("/sys:api/nstu/test:history?get=hist&sz=5&pg=2")
    expectHistory(rep, {sz: 5, pg: 2}, {ct: 20})
  })
  test("invalid options are handled gracefully", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/test:history?get=hist&sz=1")
    expectHistory(rep, {sz: 1}, {ct: 20, sz: 5})
    rep = await agent.get("/sys:api/nstu/test:history?get=hist&sz=5&pg=1100")
    console.log(rep.body)
    expectHistory(rep, {sz: 5, pg: 1100}, {ct: 20, pg: 4})
  })
})
