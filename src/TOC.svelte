<script>
  import FB from './FB.svelte'
  import Link from './Link.svelte'
  import Treelike from './Treelike.svelte'
  import { marked } from 'marked'
  import { getContext, setContext } from 'svelte'
  import { writable } from 'svelte/store'
  const tokens = getContext('tokens')
  const haspage = getContext('haspage')
  const path = getContext('path')
  const scrollinfo = getContext('scrollinfo')
  const scrolltop = getContext('scrolltop')
  const drophash = getContext('drophash')
  let headings = []
  let slugger = writable(new marked.Slugger())
  setContext('slugger', slugger)
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
        console.log(`(${this.depth}) in: ${t.depth}:${t.text}`)
        const sub = new TOCTree(this)
        t.depth = sub.depth
        this.tree.push(sub)
        return sub.add(t)
      } else if (t.depth < this.depth) {
        console.log(`(${this.depth}) out: ${t.depth}:${t.text}`)
        if (this.parent) {
          return this.parent.add(t)
        } else {
          t.depth = this.depth
          this.tree.push(t.text)
          return this
        }
      } else {
        console.log(`(${this.depth}) lvl: ${t.depth}:${t.text}`)
        this.tree.push(t.text)
        return this
      }
    }
    flat() {
      const out = []
      this.tree.forEach(h=> {
        if (typeof(h) == 'string') out.push(h)
        else {
          const z = out.pop()
          out.push([z, ...h.flat()])
        }
      })
      return out
    }
  }
  const mkh =tkns=> {
    if (tkns && tkns.length) {
      $slugger = new marked.Slugger()
      const out = new TOCTree()
      let current = out
      tkns.filter(t=> t.type == 'heading').forEach(t=> {
        current = current.add(t)
        console.log(current.depth)
      })
      headings = out.flat()
      console.log(out)
    } else {
      headings = []
    }
  }
  $: mkh($tokens)
</script>

{#if !!$haspage && headings.length}
<FB vert c="toc">
<FB>
<FB line="b2" fw={7}>CONTENTS</FB>
{#if $scrollinfo.scrollable}
<FB vert center>
<FB line="s1" fw={5}>
  <Link nolink does={gotop} disable={!$scrollinfo.scrolled}>TOP</Link>
</FB>
</FB>
{/if}
</FB>
<Treelike items={headings}/>
</FB>
{/if}
