<script>
  import { onMount } from 'svelte'
  let canvas
  let eico
  let oico
  export let x
  export let y

  $: ico = (x % 2) == 0 ? eico : oico

  class Dim {
    constructor(v) {
      this.v = v
    }
    get hv() { return this.v / 2 }
    get qv() { return this.v / 4 }
  }
  class Dim2 {
    constructor(x, y) {
      this.x = x
      this.y = y
      this.dx = new Dim(x)
      this.dy = new Dim(y)
    }
    get hx() { return this.dx.hv }
    get qx() { return this.dx.qv }
    get hy() { return this.dy.hv }
    get qy() { return this.dy.qv }
  }

  $: dim = new Dim2(x, y)
  const eid = new Dim2(16, 14)
  const oid = new Dim2(15, 13)
  $: cid = (x % 2) == 0 ? eid : oid

  const draw =(x, y)=> {
    var ctx = canvas.getContext('2d')

    const g = 3

    ctx.lineWidth = 3
    ctx.strokeStyle = '#191919'

    ctx.moveTo(g, dim.qy)
    ctx.lineTo(g, g)
    ctx.lineTo(dim.qx, g)
    
    ctx.moveTo(dim.x-dim.qx, g)
    ctx.lineTo(dim.x-g, g)
    ctx.lineTo(dim.x-g, dim.qy)
    
    ctx.moveTo(dim.x-g, dim.y-dim.qy)
    ctx.lineTo(dim.x-g, dim.y-g)
    ctx.lineTo(dim.x-dim.qx, dim.y-g)
    
    ctx.moveTo(dim.qx, dim.y-g)
    ctx.lineTo(g, dim.y-g)
    ctx.lineTo(g, dim.y-dim.qy)
   
   ctx.imageSmoothingEnabled = false
    ctx.drawImage(ico, dim.hx-cid.hx, dim.hy-cid.hy, 32, 28)

    ctx.stroke()

  }

  $: if (ico && canvas && canvas.getContext) draw(x, y)

</script>

<canvas on:click={draw(x, y)} width={x} height={y} bind:this={canvas}/>
<div >
  <img alt="foo" src="/images/heart-even.png" width={16} height={14} bind:this={eico} />
  <img alt="foo" src="/images/heart-odd.png" width={15} height={13} bind:this={oico} />
</div>


