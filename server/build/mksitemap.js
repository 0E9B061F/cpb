const fs = require('fs')
const db = require('../models')
const CPB = require('../lib/cpb.js')

const mkname =ns=> `sitemap-${ns}.xml`

const base = CPB.rc.baseURL

const mkindex =maps=> {
  let out = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
  Object.keys(maps).forEach(ns=> {
    out += `
<sitemap>
  <loc>${base}/${mkname(ns)}</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
</sitemap>`
  })
  out += `
</sitemapindex>`
  return out
}

const mkmap =map=> {
  let out = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
  map.forEach(r=> {
    out += `
<url>
  <loc>${r.loc}</loc>
  <lastmod>${r.modified}</lastmod>
</url>`
  })
  out += `
</urlset>`
  return out
}

const generate = async ()=> {
  const all = await db.version.findAll({
    attributes: ['namespace', 'title', 'createdAt'],
    where: { nextUuid: null },
    order: [['createdAt', 'DESC']],
  })
  const maps = {}
  all.forEach(r=> {
    if (!maps[r.namespace]) maps[r.namespace] = []
    const nstu = new CPB.NSTU({
      namespace: r.namespace, title: r.title,
    })
    maps[r.namespace].push({
      loc: `${base}/${nstu.normal}`,
      modified: r.createdAt.toISOString(),
    })
  })
  fs.writeFileSync(`${__dirname}/../public/sitemap.xml`, mkindex(maps))
  Object.keys(maps).forEach(ns=> {
    fs.writeFileSync(`${__dirname}/../public/${mkname(ns)}`, mkmap(maps[ns]))
  })
}

module.exports = generate
