<script>
  import Mark from './Mark.svelte'
  import { getContext } from 'svelte'

  const blockInfo = getContext('blockInfo')
  const loc = getContext('loc')
  const finished = getContext('finished')
  const page = getContext('page')
  const haspage = getContext('haspage')

  let markers = []

  class MarginMark {
    constructor(block, type) {
      this.block = block
      this.type = type
    }
  }

  const mkmarkers =()=> {
    const cmd = $loc.cmd
    const m = []
    if (cmd && $blockInfo[cmd]) {
      m.push(new MarginMark($blockInfo[cmd], 'manicule'))
    }
    markers = m
  }

  // $: if ($finished) mkmarkers($loc.cmd)
</script>

<div class="hardmargin">
  {#each markers as mark}
    <Mark {mark}/>
  {/each}
</div>

<style>
  .hardmargin {
    position: relative;
  }
</style>
