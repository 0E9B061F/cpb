<script>
  import FB from '../FB.svelte'
  import { getContext } from 'svelte'
  const hexn = getContext('hexn')
  export let mask = 0b000000
  $: solid = ($hexn & mask) == mask
</script>

<FB c="hexline" zero>
  <div class="seg wing"></div>
  <FB expand c="seg" ghost={!solid}/>
  <div class="seg wing"></div>
</FB>
