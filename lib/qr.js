'use strict'

const qrcode = require('qrcode')
const { v4 } = require ('uuid')

const n35 = '00000000000000000000000000000000000'
const n41 = '00000000000000000000000000000000000000000'

const num =()=> {
  qrcode.toFile('/tmp/qr.png', [{
    data: n41,
    mode: 'numeric'
  }], {
    version: 1,
    errorCorrectionLevel: 'low',
    maskPattern: 0,
  })
}

const qr =()=> {
  qrcode.toFile('/tmp/qr.png', v4().toUpperCase(), {
    version: 2,
    errorCorrectionLevel: 'low',
    maskPattern: 2,
  })
}

qr()
