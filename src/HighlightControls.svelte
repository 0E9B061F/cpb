<script>
  import FB from './FB.svelte'
  import Link from './link/Link.svelte'
  import Text from './doc/Text.svelte'
  import { getContext } from 'svelte'
  const loc = getContext('loc')
  const gs = getContext('gs')

  let highlights = []
  let hlstr = ''
  let creating = false

  const create =()=> {
    creating = true
  }

  const clear =()=> {
    const n = $loc.amend({opts: {hl: null}})
    $gs.goto(n.rel)
  }

  const mkhlstr =()=> {
    return highlights.map(hl=> hl.replace(/ /g, '_')).join('+')
  }

  const edited =(i, e)=> {
    if (i >= 0) highlights[i] = e.detail.val
    else highlights.push(e.detail.val)
    hlstr = mkhlstr(highlights)
  }

  const entered =(i, e)=> {
    edited(i, e)
    changed()
    if (i < 0) creating = false
  }

  const changed =()=> {
    const n = $loc.amend({opts: {hl: hlstr}})
    $gs.goto(n.rel)
  }

  const getHighlights =()=> {
    if ($loc.opts.hl) {
      highlights = $loc.opts.hl.split('+').map(x=> x.replace(/_/g, ' '))
    } else {
      highlights = []
    }
    highlights
  }

  $: getHighlights($loc)
</script>

<FB vert c="highlight-controls">
  {#each highlights as hl, i}
    <FB line="b1"><Text value={hl} on:edited={e=> edited(i, e)} on:enter={e=> entered(i, e)}/></FB>
  {/each}
  {#if !creating}
    <FB center title line="s1">
      <Link nolink does={create}>HIGHLIGHT</Link>
      <Link nolink does={clear}>CLEAR</Link>
    </FB>
  {:else}
    <FB vert zero c="new-highlight">
      <FB line="s2" fw={6}>NEW:</FB>
      <FB line="b1"><Text value="" grabfocus bluronenter on:blur={creating = false} on:enter={e=> entered(-1, e)} /></FB>
    </FB>
  {/if}
</FB>
