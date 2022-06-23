'use strict'

process.env.NODE_ENV = "test"


const request = require('supertest')
const fs = require('fs-extra')
const { db, app, CPB } = require('../server.js')
const {
  expectLogout, expectLogin, expectMissing, expectInput, expectUnauthorized,
  expectUnallowed, expectOtherUser, expectSelfUser, expectInvalid, resetdb,
  expectImage, expectEmptyTemp, expectUploads, expectPage, seedhistory,
} = require('../lib/testing.js')


beforeEach(seedhistory(db))

describe("getting author listings", ()=> {
  test("users can get author listings", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/test:history?get=authors")
    expect(rep.body.val.length).toBe(4)
    expect(rep.body.val[0].handle).toBe('qibly')
    expect(rep.body.val[0].count).toBe(10)
    expect(rep.body.val[1].handle).toBe('borg')
    expect(rep.body.val[1].count).toBe(6)
    expect(rep.body.val[2].handle).toBe('root')
    expect(rep.body.val[2].count).toBe(3)
    expect(rep.body.val[3].handle).toBe('system')
    expect(rep.body.val[3].count).toBe(1)
  })
  test("user pages can be listed", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/~qibly?get=authors")
    expect(rep.body.val.length).toBe(1)
    expect(rep.body.val[0].handle).toBe('qibly')
    expect(rep.body.val[0].count).toBe(1)
  })
  test("cannot list non-existent", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/test:foo?get=authors")
    await expectMissing(rep)
    rep = await agent.get("/sys:api/nstu/test:?get=authors")
    await expectMissing(rep)
  })
})
