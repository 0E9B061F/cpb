<script>
  import FB from '../FB.svelte'
  export let items
  export let limit = null
  export let vgap = 0
  export let line = "n"
  export let lines = null

  let style = {}
  const mkcss =()=> {
    const c = {
      'row-gap': `${vgap}px`,
    }
    if (lines) {
      c['max-height'] = `calc((var(--x${line}) * ${lines}) + ${vgap * (lines - 1)}px)`
    }
    style = c
  }

  $: mkcss(vgap, lines, line)
  $: it = limit ? items.slice(0, limit) : items
</script>

<FB wrap c="wrapper" {style}>
  {#each it as item}
    <FB {line} c="wrapped">
      <FB vert center c="wrapper-sep">
        <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" style="width:4px;height:4px;">
          <circle cx="5" cy="5" r="4"/>
        </svg>
      </FB>
      <slot item={item}></slot>
    </FB>
  {/each}
</FB>
