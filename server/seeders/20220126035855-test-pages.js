'use strict'

const LoremIpsum = require("lorem-ipsum").LoremIpsum
const { mkpages, multiconf, mkuser } = require('../lib/seeders.js')

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

const gs =(n=1)=> lorem.generateSentences(n)
const gh =(d=1)=> {
  const h = [...Array(d).keys()].map(x=> '#').join('')
  return `${h} ${gs()}\n\n`
}
const gp =(n=1)=> {
  const out = []
  for (let x = 0; x < n; x++) {
    out.push(lorem.generateParagraphs(1))
  }
  return out.join('\n\n') + '\n\n'
}

module.exports = {
  async up (queryInterface, Sequelize) {
    const uc = [...Array(25).keys()].map((x,i)=> {
      const handle = lorem.generateWords(1) + (i+1)
      return {
        handle,
        email: `${handle}@example.com`,
        pw: lorem.generateWords(1),
      }
    })
    const ud = await mkuser(queryInterface, uc)
    await mkpages(queryInterface, 1, 100, (r,inner)=> {
      r.space = 'main'
      r.title = 'test'
      inner(v=> {
        v.source = `${gh()}${gp(2)}${gh(2)}${gp(1)}${gh(2)}${gp(2)}${gh()}${gp(4)}`
      })
    }, ud)
    // return mkpages(queryInterface, 1000, 10, (r,inner)=> {
    //   r.space = 'test'
    //   r.title = gs()
    //   inner(v=> {
    //     v.source = `${gh()}${gp(2)}${gh(2)}${gp(1)}${gh(2)}${gp(2)}${gh()}${gp(4)}`
    //   })
    // }, ud)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Pages', null, {});
    await queryInterface.bulkDelete('Versions', null, {});
  }
};
