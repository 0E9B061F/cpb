<script>
  export let root = false
  export let ordered = true
  export let depth = 1
  export let c = []
  let cls = ''

  const mkcls =()=> {
    const c2 = [`list-d${depth}`, ...c]
    if (root) c2.push(root)
    cls = c2.join(' ')
  }

  $: mkcls(root, depth, c)
</script>

{#if ordered}
  <ol class={cls}>
    <slot></slot>
  </ol>
{:else}
  <ul class={cls}>
    <slot></slot>
  </ul>
{/if}
