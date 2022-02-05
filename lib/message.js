'use strict'

class Message {
  constructor(t, s, d) {
    this.text = t
    this.severity = s
    this.duration = d
    this.birth = Date.now()
    this.timer = setTimeout(()=> this.kill(), 500)
  }
  kill() {
    
  }
}
