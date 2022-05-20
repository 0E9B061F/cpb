<script>
  import Mark from './Mark.svelte'
  import { getContext } from 'svelte'

  const blockInfo = getContext('blockInfo')
  const loc = getContext('loc')
  const finished = getContext('finished')

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
    console.log(`cmd: ${cmd}`)
    if (cmd && $blockInfo[cmd]) {
      m.push(new MarginMark($blockInfo[cmd], 'manicule'))
    }
    markers = m
    console.log(markers, $blockInfo)
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
