<script>
  export let c = []

  export let expand = false
  export let solid = false
  export let exo = false
  export let vert = false
  export let leaf = false
  export let form = false
  export let flip = false
  export let zero = false
  export let center = false
  export let between = false
  export let around = false
  export let hide = false
  export let w = null
  export let spacer = null

  $: if (exo) {
    expand = true
    solid = true
  }

  let cf = ''
  let cc

  $: {
    cc = c
    if (typeof(cc) == 'string') cc = cc.split(' ')

    if (expand) cc.push('fb-expand')
    if (solid) cc.push('fb-solid')

    if (vert) cc.push('fb-vert')
    else cc.push('fb-hori')

    if (flip) cc.push('fb-flip')
    else cc.push('fb-norm')

    if (!leaf) cc.push('fb-box')
    if (form) cc.push('fb-form')
    if (zero) cc.push('fb-zero')
    else cc.push('fb-grid')

    if (center) cc.push('fb-center')
    if (between) cc.push('fb-between')
    if (around) cc.push('fb-around')
    if (hide) cc.push('hidden')

    if (w) cc.push(`w${w}`)

    if (spacer) cc.push(`spacer${spacer}`)

    cc.push('flexbox')

    cf = cc.join(' ')
  }
</script>

<div class={cf}>
  <slot></slot>
</div>
