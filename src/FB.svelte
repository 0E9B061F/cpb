<script>
  export let c = []

  export let expand = false
  export let vert = false
  export let leaf = false
  export let form = false
  export let flip = false
  export let zero = false
  export let center = false
  export let between = false
  export let around = false
  export let hide = false

  let cf = ''
  let cc

  $: {
    cc = c
    if (typeof(cc) == 'string') cc = cc.split(' ')

    if (expand) cc.push('fb-expand')

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

    cf = cc.join(' ')
  }
</script>

<div class="flexbox {cf}">
  <slot></slot>
</div>
