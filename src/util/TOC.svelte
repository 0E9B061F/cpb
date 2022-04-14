<script>
  import FB from '../FB.svelte'
  import Link from '../Link.svelte'
  import Treelike from '../util/Treelike.svelte'

  import { marked } from 'marked'
  import { getContext, setContext } from 'svelte'
  import { writable } from 'svelte/store'

  const tokens = getContext('tokens')
  const state = getContext('state')
  const path = getContext('path')

  export let limit = null
  let headings = []
  let slugger = new marked.Slugger()

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
    console.log(headings)
  }

  $: rl = limit === null ? null : limit - 1
  $: mkh($tokens)
</script>

{#if headings.length}
  <Treelike items={headings} let:item={item}>
    {#if typeof(item) == 'string'}
      <Link nored self cmd={slugger.slug(item)}>{item}</Link>
    {:else}
      <Link nored self cmd={slugger.slug(item[0])}>{item[0]}</Link>
      <span class="toc-plus">+</span>
    {/if}
  </Treelike>
{:else}
  <div class="toc-message">
    <slot>NONE</slot>
  </div>
{/if}
