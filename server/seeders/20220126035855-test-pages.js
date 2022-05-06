'use strict'

const fs = require('fs')
const { v4 } = require ('uuid')
const LoremIpsum = require("lorem-ipsum").LoremIpsum
const homedata = fs.readFileSync('./data/Home.md', {encoding: 'utf-8'})

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 9,
    min: 4
  },
  wordsPerSentence: {
    max: 12,
    min: 3
  }
})

const gp =(n=1)=> {
  return lorem.generateParagraphs(n)
}
const gs =(n=1)=> {
  return lorem.generateSentences(n)
}

const mkpgs = async (qi, n, u, cb)=> {
  const d = new Date()
  let pgs = [...Array(n).keys()]
  pgs = pgs.map(x=> {
    return {
      uuid: v4(),
      userUuid: u.uuid,
      createdAt: d,
      updatedAt: d,
    }
  })
  await qi.bulkInsert('Pages', pgs)
  let c = 0
  let vers = pgs.map(p=> {
    c += 1
    return cb({
      uuid: v4(),
      namespace: 'main',
      pageUuid: p.uuid,
      userUuid: u.uuid,
      createdAt: d,
      updatedAt: d,
    }, c - 1)
  })
  await qi.bulkInsert('Versions', vers)
}

module.exports = {
  async up (queryInterface, Sequelize) {
    let root = await queryInterface.sequelize.query(
      `SELECT uuid from USERS where handle="root";`
    )
    root = root[0][0]

    await mkpgs(queryInterface, 1000, root, v=> {
      return Object.assign(v, {
        title: lorem.generateSentences(1),
        body: `# ${gs()}\n\n${gp()}\n\n${gp()}\n\n## ${gs()}\n\n${gp()}\n\n`,
      })
    })

    await mkpgs(queryInterface, 11, root, (v,c)=> {
      return Object.assign(v, {
        title: `xqx ${c}`,
        body: `# a xqx article\n\nthis article contains the word 'xqx'`,
      })
    })

    const hd = new Date()
    const hu = v4()
    await queryInterface.bulkInsert('Pages', [{
      uuid: hu,
      userUuid: root.uuid,
      createdAt: hd,
      updatedAt: hd,
    }])
    const ids = [...Array(50).keys()].map(x=> v4())
    let pid, cid, nid, hver
    const hvers = []
    for (let n = 0; n < ids.length; n++) {
      pid = ids[n-1]
      cid = ids[n]
      nid = ids[n+1]
      hver = {
        uuid: cid,
        namespace: 'main',
        title: 'Home',
        body: homedata + `\n\n${cid}`,
        pageUuid: hu,
        userUuid: root.uuid,
        createdAt: hd,
        updatedAt: hd,
        vnum: n+1,
      }
      if (pid) hver.prevUuid = pid
      if (nid) hver.nextUuid = nid
      hvers.push(hver)
    }
    return await queryInterface.bulkInsert('Versions', hvers)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Pages', null, {});
    await queryInterface.bulkDelete('Versions', null, {});
  }
};
