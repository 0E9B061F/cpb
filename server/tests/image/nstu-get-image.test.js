'use strict'

process.env.NODE_ENV = "test"


const request = require('supertest')
const fs = require('fs-extra')
const { db, app, CPB } = require('../../server.js')
const {
  expectLogout, expectLogin, expectMissing, expectInput, expectUnauthorized,
  expectUnallowed, expectOtherUser, expectSelfUser, expectInvalid, resetdb,
  expectImage, expectEmptyTemp, expectUploads,
} = require('../../lib/testing.js')


beforeEach(resetdb(db, true))

afterEach(async()=> {
  await fs.remove(CPB.rc.uploads.path)
  await fs.remove(CPB.rc.uploads.temp)
  await fs.mkdirp(CPB.rc.uploads.path)
  await fs.mkdirp(CPB.rc.uploads.temp)
})


describe("getting image resources", ()=> {
  test("users can get image resources", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/img:foo")
    await expectImage(rep)
    rep = await agent.get("/sys:api/nstu/img:bar")
    await expectImage(rep)
  })
})
