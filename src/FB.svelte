<script>
  export let id = null
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
  export let ghost = false
  export let w = null
  export let wr = null
  export let spacer = null
  export let line = false
  export let para = false
  export let tight = false
  export let grid = false
  export let end = false
  export let just = false
  export let fw = false
  export let lw = false
  export let rel = false
  export let abs = false
  export let wrap = false
  export let title = false
  export let mono = false
  export let reverse = false
  export let flex = false

  export let tag = 'div'

  export let vc = false
  export let ve = false

  export let style = {}

  $: css = Object.entries(style).map(p=> `${p[0]}: ${p[1]};`).join('')

  $: if (exo) {
    expand = true
    solid = true
  }

  let cf = ''
  let cc

  $: {
    cc = c
    if (typeof(cc) == 'string') cc = cc.split(' ')

    if (expand && !(vc || ve)) cc.push('fb-expand')
    if (solid) cc.push('fb-solid')
    if (flex) cc.push('fb-flex')

    if (vert) cc.push('fb-vert')
    else cc.push('fb-hori')

    if (flip) cc.push('fb-flip')
    else cc.push('fb-norm')

    if (!leaf) cc.push('fb-box')
    if (form) cc.push('fb-form')
    if (zero) cc.push('fb-zero')
    else cc.push('fb-grid')

    if (just) {
      if (just == 'c') cc.push('fb-center')
      else if (just == 'b') cc.push('fb-between')
      else if (just == 'a') cc.push('fb-around')
      else if (just == 'e') cc.push('fb-end')
      else cc.push('fb-start')
    } else {
      if (center) cc.push('fb-center')
      else if (between) cc.push('fb-between')
      else if (around) cc.push('fb-around')
      else if (end) cc.push('fb-end')
      else cc.push('fb-start')
    }

    if (hide) cc.push('hidden')
    if (ghost) cc.push('ghost')

    if (w) cc.push(`w${w}`)
    if (wr) cc.push(`wr${wr}`)
    if (fw) cc.push(`fw${fw}`)
    if (lw) cc.push(`lw${lw}`)

    if (spacer) cc.push(`spacer${spacer}`)

    if (rel) cc.push('fb-rel')
    if (abs) cc.push('fb-abs')
    if (wrap) cc.push('fb-wrap')

    if (line) {
      cc.push('fd-line')
      const n = typeof(line) != 'string' ? 'n' : line
      cc.push(`ln-${n}`)
    } else if (para) {
      cc.push('fd-para')
      const n = typeof(para) != 'string' ? 'n' : para
      cc.push(`ln-${n}`)
    }
    if (tight) cc.push('tight')

    if (grid) {
      cc.push('gr')
      cc.push(`gr${grid}`)
    }

    if (title) cc.push('fb-title')
    if (mono) cc.push('fb-mono')
    if (reverse) cc.push('fb-reverse')

    cc.push('flexbox')

    cf = cc.join(' ')
  }

  export let element = null
</script>

{#if vc || ve}
  <svelte:self {expand} vert center={vc} end={ve} bind:element={element} style={css}>
    <svelte:element this={tag} class={cf} {id}>
      <slot></slot>
    </svelte:element>
  </svelte:self>
{:else}
  <svelte:element this={tag} class={cf} bind:this={element} style={css} {id}>
    <slot></slot>
  </svelte:element>
{/if}
