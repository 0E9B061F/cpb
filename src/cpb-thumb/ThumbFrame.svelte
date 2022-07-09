<script>
  import FB from '../FB.svelte'
  export let classes
  export let style
  export let selected
  export let image
</script>

<FB center c={classes} {style}>
  <FB vert center>
    <FB center c="thumb-frame">
      <FB vert center>
        <img src={selected.rel} alt={image.title}/>
      </FB>
    </FB>
  </FB>
</FB>
