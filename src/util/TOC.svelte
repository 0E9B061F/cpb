<script>
  import FB from '../FB.svelte'
  import Link from '../link/Link.svelte'
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

  class TOCItem {
    constructor(token) {
      this.token = token
      this.real = this.token.text
      this.plain = flattoken(this.token)
    }
    get isItem() { return true }
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
          this.tree.push(new TOCItem(t))
          return this
        }
      } else {
        this.tree.push(new TOCItem(t))
        return this
      }
    }
    count() {
      let c = 0
      this.tree.forEach(h=> {
        if (h.isItem) c += 1
        else c += h.count()
      })
      return c
    }
    flat(lim=null, depth=0) {
      const out = []
      if (lim !== null && depth > lim) return [this.count()]
      this.tree.forEach(h=> {
        if (h.isItem) out.push(h)
        else {
          const z = out.pop()
          out.push([z, ...h.flat(lim, depth+1)])
        }
      })
      return out
    }
  }

  const flattoken =token=> {
    const out = []
    if (token.tokens?.length) {
      token.tokens.forEach(t=> {
        out.push(flattoken(t))
      })
    } else {
      out.push(token.text)
    }
    return out.join('')
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
  }

  $: rl = limit === null ? null : limit - 1
  $: mkh($tokens)
</script>

{#if headings.length}
  <Treelike items={headings} let:item={item}>
    {#if item.isItem}
      <Link nored self cmd={slugger.slug(item.real)}>{item.plain}</Link>
    {:else}
      <Link nored self cmd={slugger.slug(item[0].real)}>{item[0].plain}</Link>
      <span class="toc-plus">+</span>
    {/if}
  </Treelike>
{:else}
  <div class="toc-message">
    <slot>NONE</slot>
  </div>
{/if}
