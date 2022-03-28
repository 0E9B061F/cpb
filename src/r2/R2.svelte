<script>
  import FB from '../FB.svelte'
  export let size = 5
  export let fillv = false
  export let fillh = false
  export let raise = false
  export let hyper = false
  export let abs = false
  let c
  const mkc =()=> {
    let mc = ['r2']
    if (size == 'x') mc.push('r2-sx')
    else mc.push(`r2-s${size * 10}`)
    if (hyper) mc.push('r2-hyper')
    else if (raise) mc.push('r2-raised')
    if (abs) mc.push('r2-abs')
    c = mc
  }
  $: mkc(size, raise, abs)
</script>

<FB expand zero {c}>
  <FB vert between zero c="r2-col r2-left {fillv ? 'r2-bar' : ''}">
    {#if !fillv}
      <div class="r2-bar r2-vert"></div>
      <div class="r2-bar r2-vert"></div>
    {/if}
  </FB>

  <FB vert expand zero between c="r2-col r2-mid">
    <FB between zero c="r2-row r2-top {fillh ? 'r2-bar' : ''}">
      {#if !fillh}
        <div class="r2-bar r2-hori"></div>
        <div class="r2-bar r2-hori"></div>
      {/if}
    </FB>
    {#if $$slots.default}
      <FB vert expand c="r2-row r2-content"><slot></slot></FB>
    {/if}
    <FB between zero c="r2-row r2-bot {fillh ? 'r2-bar' : ''}">
      {#if !fillh}
        <div class="r2-bar r2-hori"></div>
        <div class="r2-bar r2-hori"></div>
      {/if}
    </FB>
  </FB>

  <FB vert between zero c="r2-col r2-right {fillv ? 'r2-bar' : ''}">
    {#if !fillv}
      <div class="r2-bar r2-vert"></div>
      <div class="r2-bar r2-vert"></div>
    {/if}
  </FB>
</FB>
