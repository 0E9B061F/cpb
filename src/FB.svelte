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
  export let wr = null
  export let spacer = null
  export let line = false
  export let grid = false
  export let end = false
  export let just = false
  export let fw = false
  export let lw = false

  export let vc = false

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

    if (w) cc.push(`w${w}`)
    if (wr) cc.push(`wr${wr}`)
    if (fw) cc.push(`fw${fw}`)
    if (lw) cc.push(`lw${lw}`)

    if (spacer) cc.push(`spacer${spacer}`)

    if (line) {
      cc.push('fd-line')
      const n = typeof(line) != 'string' ? 'n' : line
      cc.push(`ln-${n}`)
    }

    if (grid) {
      cc.push('gr')
      cc.push(`gr${grid}`)
    }

    cc.push('flexbox')

    cf = cc.join(' ')
  }

  export let element = null
</script>

{#if vc}
  <div class="flexbox fb-vert fb-center fb-box fb-norm" bind:this={element}>
    <div class={cf}>
      <slot></slot>
    </div>
  </div>
{:else}
  <div class={cf} bind:this={element}>
    <slot></slot>
  </div>
{/if}
