<script>
  import FB from './FB.svelte'
  export let ul = false
  export let ur = false
  export let bl = false
  export let br = false
</script>

{#if ul}
<FB vert zero c="corner">
  <FB zero c="corner-h">
    <FB leaf c="corner-ul" />
    <FB expand leaf c="corner-hb" />
  </FB>
  <FB expand zero c="corner-v">
    <FB leaf c="corner-vb" />
    <FB leaf expand />
  </FB>
</FB>
{:else if ur}
<FB vert zero c="corner">
  <FB zero c="corner-h">
    <FB expand leaf c="corner-hb" />
    <FB leaf c="corner-ur" />
  </FB>
  <FB expand zero c="corner-v">
    <FB leaf expand />
    <FB leaf c="corner-vb" />
  </FB>
</FB>
{:else if bl}
<FB vert zero c="corner">
  <FB expand zero c="corner-v">
    <FB leaf c="corner-vb" />
    <FB leaf expand />
  </FB>
  <FB zero c="corner-h">
    <FB leaf c="corner-bl" />
    <FB expand leaf c="corner-hb" />
  </FB>
</FB>
{:else if br}
<FB vert zero c="corner">
  <FB expand zero c="corner-v">
    <FB leaf expand />
    <FB leaf c="corner-vb" />
  </FB>
  <FB zero c="corner-h">
    <FB expand leaf c="corner-hb" />
    <FB leaf c="corner-br" />
  </FB>
</FB>
{/if}
