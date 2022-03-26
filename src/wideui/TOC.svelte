<script>
  import FB from '../FB.svelte'
  import Link from '../Link.svelte'
  import Treelike from '../util/Treelike.svelte'
  import WUIModule from './WUIModule.svelte'
  import WUIButton from './WUIButton.svelte'
  import { marked } from 'marked'
  import { getContext, setContext } from 'svelte'
  import { writable } from 'svelte/store'
  const tokens = getContext('tokens')
  const state = getContext('state')
  const path = getContext('path')
  const scrollinfo = getContext('scrollinfo')
  const scrolltop = getContext('scrolltop')
  const drophash = getContext('drophash')
  export let limit = null
  let headings = []
  let slugger = new marked.Slugger()
  const gotop =()=> {
    drophash()
    scrolltop()
  }
  class TOCTree {
    constructor(p=null) {
      this.parent = p
      this.tree = []
      this.depth = this.parent ? this.parent.depth + 1 : null
    }
    add(t) {
      if (this.depth === null) this.depth = t.depth
      if (t.depth > this.depth) {
        const sub = new TOCTree(this)
        t.depth = sub.depth
        this.tree.push(sub)
        return sub.add(t)
      } else if (t.depth < this.depth) {
        if (this.parent) {
          return this.parent.add(t)
        } else {
          t.depth = this.depth
          this.tree.push(t.text)
          return this
        }
      } else {
        this.tree.push(t.text)
        return this
      }
    }
    count() {
      let c = 0
      this.tree.forEach(h=> {
        if (typeof(h) == 'string') c += 1
        else c += h.count()
      })
      return c
    }
    flat(lim=null, depth=0) {
      const out = []
      if (lim !== null && depth > lim) return [this.count()]
      this.tree.forEach(h=> {
        if (typeof(h) == 'string') out.push(h)
        else {
          const z = out.pop()
          out.push([z, ...h.flat(lim, depth+1)])
        }
      })
      return out
    }
  }
  $: rl = limit === null ? null : limit - 1
  const mkh =tkns=> {
    if (tkns && tkns.length) {
      slugger = new marked.Slugger()
      const out = new TOCTree()
      let current = out
      tkns.filter(t=> t.type == 'heading').forEach(t=> {
        current = current.add(t)
      })
      headings = out.flat(rl)
    } else {
      headings = []
    }
  }
  $: mkh($tokens)
</script>

{#if $state.content && headings.length}
  <WUIModule>

    <svelte:fragment slot="title">CONTENTS</svelte:fragment>

    <svelte:fragment slot="controls">
      {#if $scrollinfo.scrollable}
        <WUIButton>
          <Link nolink does={gotop} disable={!$scrollinfo.scrolled}>TOP</Link>
        </WUIButton>
      {/if}
    </svelte:fragment>

    <svelte:fragment slot="body">
      <Treelike items={headings} let:item={item}>
        {#if typeof(item) == 'string'}
          <Link nored self cmd={slugger.slug(item)}>{item}</Link>
        {:else}
          {#if typeof(item[1]) == 'number'}
            <Link nored self cmd={slugger.slug(item[0])}>{item[0]}</Link>
            <span class="toc-plus">+</span>
          {:else}
            <Link nored self cmd={slugger.slug(item[0])}>{item[0]}</Link>
          {/if}
        {/if}
      </Treelike>
    </svelte:fragment>

  </WUIModule>
{/if}
