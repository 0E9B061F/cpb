'use strict'

process.env.NODE_ENV = "test"


const request = require('supertest')
const fs = require('fs-extra')
const { db, app, CPB } = require('../server.js')
const {
  expectLogout, expectLogin, expectMissing, expectInput, expectUnauthorized,
  expectUnallowed, expectOtherUser, expectSelfUser, expectInvalid, resetdb,
  expectImage, expectEmptyTemp, expectUploads, expectPage, seedhistory,
  expectListing, seedmany,
} = require('../lib/testing.js')


beforeEach(seedmany(db, true))

describe("getting listings", ()=> {
  test("users can get generic listings", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/?get=list")
    expectListing(rep, {}, {ct: 109})
  })
  test("results are paginated", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/?get=list&pg=2")
    expectListing(rep, {pg: 2}, {ct: 109})
    rep = await agent.get("/sys:api/nstu/?get=list&pg=5")
    expectListing(rep, {pg: 5}, {ct: 109, length: 9})
    rep = await agent.get("/sys:api/nstu/?get=list&pg=100")
    expectListing(rep, {pg: 100}, {ct: 109, pg: 5, length: 9})
    rep = await agent.get("/sys:api/nstu/?get=list&pg=22&sz=5")
    expectListing(rep, {pg: 22, sz: 5}, {ct: 109, length: 4})
    rep = await agent.get("/sys:api/nstu/?get=list&pg=23&sz=5")
    expectListing(rep, {pg: 23, sz: 5}, {ct: 109, pg: 22, length: 4})
    rep = await agent.get("/sys:api/nstu/?get=list&pg=0&sz=50")
    expectListing(rep, {pg: 0, sz: 50}, {ct: 109, pg: 1})
    rep = await agent.get("/sys:api/nstu/?get=list&pg=10&sz=1")
    expectListing(rep, {pg: 10, sz: 1}, {ct: 109, pg: 10, sz: 5, length: 5})
    rep = await agent.get("/sys:api/nstu/?get=list&pg=20&sz=100")
    expectListing(rep, {pg: 20, sz: 100}, {ct: 109, pg: 3, sz: 50, length: 9})
  })
  test("results can be filtered by type", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/?get=list&type=user")
    await expectListing(rep, {type: 'user'}, {ct: 5})
    rep = await agent.get("/sys:api/nstu/?get=list&type=image")
    await expectListing(rep, {type: 'image'}, {ct: 2})
    rep = await agent.get("/sys:api/nstu/?get=list&type=page")
    await expectListing(rep, {type: 'page'}, {ct: 102})
    rep = await agent.get("/sys:api/nstu/?get=list&type=page,image")
    await expectListing(rep, {type: 'image,page'}, {ct: 104})
    rep = await agent.get("/sys:api/nstu/?get=list&type=image,user")
    await expectListing(rep, {type: 'image,user'}, {ct: 7})
    rep = await agent.get("/sys:api/nstu/?get=list&type=page,user")
    await expectListing(rep, {type: 'page,user'}, {ct: 107})
    rep = await agent.get("/sys:api/nstu/?get=list")
    await expectListing(rep, {}, {ct: 109})
  })
  test("individual namespaces can be listed", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/test:?get=list")
    expectListing(rep, {}, {ct: 100})
    rep = await agent.get("/sys:api/nstu/main:?get=list")
    expectListing(rep, {}, {ct: 1})
    rep = await agent.get("/sys:api/nstu/docs:?get=list")
    expectListing(rep, {}, {ct: 1})
    rep = await agent.get("/sys:api/nstu/img:?get=list")
    expectListing(rep, {}, {ct: 2})
  })
  test("listings are searchable", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/test:?get=list&q=foo")
    expectListing(rep, {}, {ct: 20})
    rep = await agent.get("/sys:api/nstu/test:?get=list&q=baz")
    expectListing(rep, {}, {ct: 15})
    rep = await agent.get("/sys:api/nstu/test:?get=list&q=bat")
    expectListing(rep, {}, {ct: 10})
  })
  test("searches can be restricted to titles or page source", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/test:?get=list&q=item&inf=title")
    expectListing(rep, {inf: 'title'}, {ct: 0})
    rep = await agent.get("/sys:api/nstu/test:?get=list&q=item&inf=source")
    expectListing(rep, {inf: 'source'}, {ct: 100})
    rep = await agent.get("/sys:api/nstu/test:?get=list&q=page&inf=title")
    expectListing(rep, {inf: 'title'}, {ct: 100})
    rep = await agent.get("/sys:api/nstu/test:?get=list&q=page&inf=source")
    expectListing(rep, {inf: 'source'}, {ct: 0})
  })
  test("listings may include historical items", async()=> {
    const agent = request.agent(app)
    let rep = await agent.get("/sys:api/nstu/?get=list&inh=true")
    expectListing(rep, {inh: true}, {ct: 128})
    rep = await agent.get("/sys:api/nstu/test:?get=list&inh=true")
    expectListing(rep, {inh: true}, {ct: 119})
    rep = await agent.get("/sys:api/nstu/test:?get=list&q=100")
    expectListing(rep, {}, {ct: 1})
    rep = await agent.get("/sys:api/nstu/test:?get=list&q=100&inh=true")
    expectListing(rep, {inh: true}, {ct: 20})
  })
})
