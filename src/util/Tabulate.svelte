<script>
  import FB from '../FB.svelte'
  import Strike from './Strike.svelte'
  export let data = {}
  export let rows = 3
  export let line = 'n'
  export let usew = 9

  let chunks = []
  let cols = 0
  let usec = ''

  const parse =()=> {
    const entries = Object.entries(data)
    chunks = []
    for (let i = 0; i < entries.length; i += rows) {
      const chunk = entries.slice(i, i+rows)
      const short = rows - chunk.length;
      [...Array(short).keys()].forEach(s=> chunk.push(null))
      chunks.push(chunk)
    }
    cols = chunks.length
  }

  $: parse(data, rows)
  $: usec = `tab${usew * 10}`
</script>

<FB c="cpbtab cols-{cols} {usec}" around>
  {#each chunks as chunk, ci}
    <FB vert c="cpbtab-col col{ci+1}">
      {#each chunk as pair}
        <FB {line} c="cpbtab-row">
          {#if pair}
            <FB c="cpbtab-key">{pair[0]}</FB>
            <Strike/>
            <FB c="cpbtab-val">{pair[1]}</FB>
          {:else}
            <Strike/>
          {/if}
        </FB>
      {/each}
    </FB>
  {/each}
</FB>
