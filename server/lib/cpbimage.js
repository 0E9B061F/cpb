'ust strict'

const CPB = require('./cpb.js')
const sharp = require('sharp')
const pathlib = require('path')
const fs = require('fs')


class CPBImage {
  constructor(path) {
    this.path = path
    this.dirname = pathlib.dirname(this.path)
    this.extname = pathlib.extname(this.path)
    this.basename = pathlib.basename(this.path)
    this.corename = pathlib.basename(this.path, this.extname)
    this.thumbs = {}
  }
  async prep() {
    this.sharp = await sharp(this.path)
    this.meta = await this.sharp.metadata()
    this.x = this.meta.width
    this.y = this.meta.height
    this.size = (await fs.promises.stat(this.path)).size
    for (let x = 0; x < CPB.rc.images.thumbnails.length; x++) {
      const s = CPB.rc.images.thumbnails[x]
      this.thumbs[s] = new CPBThumb(this, this.thumbpath(s), s)
      await this.thumbs[s].prep()
    }
  }
  get max() { return Math.max(this.x, this.y) }
  thumbpath(s) {
    s = `${s}`.padStart(3, '0')
    return `${this.dirname}/${this.corename}-${s}${this.extname}`
  }
  thumbinfo(force={}) {
    return Object.values(this.thumbs).map(t=> {
      return Object.assign({
        path: t.path,
        thumb: t.thumb,
        x: t.x,
        y: t.y,
        size: t.size,
      }, force)
    })
  }
  async rmall() {
    console.log(`deleting ${this.path}`)
    await fs.promises.unlink(this.path)
    const vals = Object.values(this.thumbs)
    for (let x = 0; x < vals.length; x++) {
      const th = vals[x]
      console.log(`deleting ${th.path}`)
      await fs.promises.unlink(th.path)
    }
  }
}

class CPBThumb {
  constructor(img, path, thumb) {
    this.img = img
    this.path = path
    this.thumb = thumb
  }
  async prep() {
    await this.img.sharp.resize(this.thumb, this.thumb, {fit: 'inside'}).toFile(this.path)
    this.sharp = await sharp(this.path)
    this.meta = await this.sharp.metadata()
    this.x = this.meta.width
    this.y = this.meta.height
    this.size = (await fs.promises.stat(this.path)).size
  }
}


module.exports = CPBImage
