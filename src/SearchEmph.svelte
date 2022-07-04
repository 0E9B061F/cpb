<script>
  export let text = ''
  let left = null
  let center = null
  let right = null
  const set =()=> {
    left = null
    center = null
    right = null
    if (text && typeof(text) != 'string') {
      console.log(text)
      left = text[0]
      center = text[1]
      right = text[2]
    }
  }
  $: set(text)
</script>

<span class="emphatic">
  {#if center}
    {#if left}<span class="emph-left">{left}</span>{/if}<span class="emph-center">{center}</span>{#if right}<span class="emph-right">{right}</span>{/if}
  {:else if text}
    {text}
  {/if}
</span>
