<script>
  import FB from '../FB.svelte'
  export let selected
  export let image
</script>

<FB center c="thumb-frame">
  <FB vert center>
    <img src={selected.rel} alt={image.title}/>
  </FB>
</FB>
