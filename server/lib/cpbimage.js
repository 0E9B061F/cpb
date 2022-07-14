'ust strict'

const CPB = require('./cpb.js')
const sharp = require('sharp')
const pathlib = require('path')
const fs = require('fs')
const util = require('./util.js')

const rm =async(path)=> {
  try {
    await fs.promises.access(path, fs.constants.W_OK)
  } catch (e) {
    return
  }
  await fs.promises.unlink(path)
}

class CPBUpload {
  constructor(path, mime, rename=false, preserve=false) {
    this.path = path
    this.mime = mime
    this.ext = util.extmap[this.mime]
    this.valid = this.mime.match(util.validmime.image)
    this.basename = pathlib.basename(this.path)
    this.rename = rename
    const tbase = this.rename ? `${this.rename}.${this.ext}` : this.basename
    this.target = `${CPB.rc.uploads.path}/${tbase}`
    this.preserve = preserve
    this.image = null
  }
  async mkimage() {
    await fs.promises.copyFile(this.path, this.target)
    this.image = new CPBImage(this.target)
    await this.image.prep()
    return this.image
  }
  async cleanup() {
    if (!this.preserve) await rm(this.path)
  }
  async rmall() {
    await this.cleanup()
    if (this.image) await this.image.rmall()
    await rm(this.target)
  }
}

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
    const max = Math.max(this.x, this.y)
    for (let x = 0; x < CPB.rc.images.thumbnails.length; x++) {
      const s = CPB.rc.images.thumbnails[x]
      if (s < max) {
        this.thumbs[s] = new CPBThumb(this, this.thumbpath(s), s)
        await this.thumbs[s].prep()
      }
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
    await rm(this.path)
    const vals = Object.values(this.thumbs)
    for (let x = 0; x < vals.length; x++) {
      const th = vals[x]
      await rm(th.path)
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


module.exports = { CPBUpload, CPBImage }
