<script>
  import FB from '../FB.svelte'
  import Link from '../link/Link.svelte'
  import Separated from '../util/Separated.svelte'
  import { getContext } from 'svelte'

  import BookmarkCtrl from './BookmarkCtrl.svelte'
  import DeleteCtrl from './DeleteCtrl.svelte'
  import DuplicateCtrl from './DuplicateCtrl.svelte'
  import MoveCtrl from './MoveCtrl.svelte'

  const loc = getContext('loc')
  const haslogin = getContext('haslogin')

  let tab
  let cmp

  class Control {
    constructor(name, label, cmp) {
      this.name = name
      this.label = label || name
      this.cmp = cmp
    }
  }
  class Tabs {
    constructor(tabs={}) {
      this.tabs = tabs
      this.controls = Object.values(this.tabs)
    }
    add(n, cmp) {
      Object.assign(this.tabs, {[n]: new Control(n, n, cmp)})
      this.controls = Object.values(this.tabs)
    }
    get(n) { return this.tabs[n] }
    cmp(n) { return this.get(n)?.cmp }
  }

  let tabs = new Tabs()

  const mktabs =()=> {
    const t = new Tabs()
    if ($haslogin) {
      t.add('bookmark', BookmarkCtrl)
      if ($state.anchor) {
        t.add('move', MoveCtrl)
        t.add('delete', DeleteCtrl)
      }
      t.add('duplicate', DuplicateCtrl)
    }
    tabs = t
    if (!tabs.get(tab)) {
      tab = null
      cmp = null
    } else {
      const c = tabs.cmp(tab)
      if (c != cmp) cmp = tabs.cmp(tab)
    }
  }

  const show =n=> {
    tab = n
    cmp = tabs.cmp(n)
  }

  $: mktabs($haslogin)
  $: show($loc.opts.tab)
  $: open = !!cmp
</script>

<FB vert c="content-controls system {open ? 'open' : ''}">
  <FB end c="tabs">
    {#if !tab}
      <Separated items={tabs.controls} line="s1" let:item={item}>
        <Link self opt={{tab:item.name}}>{item.label}</Link>
      </Separated>
    {:else}
      <FB title line="s1">
        <Link self global opt={{tab:null}}>CANCEL</Link>
        &middot; <FB fw={6}>{tab}</FB>
      </FB>
    {/if}
  </FB>
  <FB end>
    <svelte:component this={cmp}/>
  </FB>
</FB>
