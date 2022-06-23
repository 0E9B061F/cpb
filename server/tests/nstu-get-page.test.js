'use strict'

process.env.NODE_ENV = "test"


const request = require('supertest')
const fs = require('fs-extra')
const { db, app, CPB } = require('../server.js')
const {
  expectLogout, expectLogin, expectMissing, expectInput, expectUnauthorized,
  expectUnallowed, expectOtherUser, expectSelfUser, expectInvalid, resetdb,
  expectImage, expectEmptyTemp, expectUploads, expectPage,
} = require('../lib/testing.js')


beforeEach(resetdb(db))

describe("getting page resources", ()=> {
  test("users can get page resources", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/main:Home")
    await expectPage(rep)
    rep = await agent.get("/sys:api/nstu/docs:WMD")
    await expectPage(rep)
  })
})
