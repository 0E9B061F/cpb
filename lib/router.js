'use strict'


class Resolution {
  constructor(cmp) {
    if (typeof(cmp) == 'number') {
      this.err = cmp
      this.cmp = geterr(this.err)
    } else {
      this.err = 0
      this.cmp = cmp
    }
  }
}

class Route {
  constructor(cmp, cnd=()=>true) {
    this.cmp = cmp
    this.cnd = cnd
  }
  resolve() {
    const r = this.cnd()
    if (typeof(r) == 'number') {
      return new Resolution(r)
    } else if (r === true) {
      return new Resolution(this.cmp)
    } else {
      return new Resolution(500)
    }
  }
}

class Router {
  constructor(routes, special) {
    this.routes = routes
  }
  has(p) {
    return !!this.routes[p]
  }
  nav(p) {
    if (this.has(p)) return this.routes[p].resolve()
    else return new Resolution(404)
  }
}


module.exports = Router
