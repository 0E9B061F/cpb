<script>
  import Cite from './inlines/Cite.svelte'
  import Classed from './inlines/Classed.svelte'
  const commands = {
    cite: Cite,
    '.': Classed,
  }
  const decmd = /^(?<cmd>[a-zA-Z][a-zA-Z0-9\-_]*)(?:\/(?<args>.+))?$/
  export let cmd
  export let text = null
  let rcmd, args
  const mkrcmd =()=> {
    rcmd = null
    args = []
    if (cmd[0] == '.') {
      rcmd = '.'
      args = cmd.slice(1).split('.')
    } else {
      const match = decmd.exec(cmd)
      if (match) {
        rcmd = match.groups.cmd
        args = match.groups.args?.split(' ')
      }
    }
  }
  $: mkrcmd(cmd)
  $: cmp = commands[rcmd]
</script>

{#if cmp}
  <svelte:component this={cmp} args={args}>
    <slot></slot>
  </svelte:component>
{/if}
