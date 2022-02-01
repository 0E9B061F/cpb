<script>
  import FB from './FB.svelte'
  import Corner from './Corner.svelte'
  export let size = 5
  let rs, c
  $: {
    rs = size * 10
    c = ['reticle', `reticle-s${rs}`]
  }
</script>

<FB vert zero {c}>
  <FB zero c="reticle-row">
    <Corner ul/>
    <FB leaf expand/>
    <Corner ur/>
  </FB>
  <FB vert center expand c="reticle-row reticle-body">
    <slot></slot>
  </FB>
  <FB zero c="reticle-row">
    <Corner bl/>
    <FB leaf expand/>
    <Corner br/>
  </FB>
</FB>
