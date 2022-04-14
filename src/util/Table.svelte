<script>
  import FB from '../FB.svelte'
  import Strike from './Strike.svelte'
  export let data = {}
  export let rows = 3
  export let line = 'n'

  let chunks = []
  let cols = 0

  const parse =()=> {
    const entries = Object.entries(data)
    chunks = []
    for (let i = 0; i < entries.length; i += rows) {
      const chunk = entries.slice(i, i+rows)
      const short = rows - chunk.length
      const co = {
        keys: [],
        vals: [],
      }
      chunk.forEach(p=> {
        co.keys.push(p[0])
        co.vals.push(p[1])
      });
      [...Array(short).keys()].forEach(s=> {
        co.keys.push(null)
      })
      chunks.push(co)
    }
    cols = chunks.length
  }

  $: parse(data, rows)
</script>

<FB c="cpbtab cols-{cols}" around>
  {#each chunks as chunk, ci}
    <FB c="cpbtab-col col{ci+1}">
      <FB vert c="cpbtab-kcol">
        {#each chunk.keys as key, ri}
          <FB {line} c="cpbtab-key row{ri+1}" end>
            {#if key}
              {key}
            {:else}
              <Strike/>
            {/if}
          </FB>
        {/each}
      </FB>
      <FB expand vert c="cpbtab-gapcol">
        {#each chunk.keys as key, ri}
          <FB {line} c="cpbtab-gap row{ri+1}">
            <Strike/>
          </FB>
        {/each}
      </FB>
      <FB vert c="cpbtab-vcol">
        {#each chunk.keys as key, ri}
          <FB {line} c="cpbtab-val row{ri+1}">
            {#if key}
              {chunk.vals[ri]}
            {:else}
              <Strike/>
            {/if}
          </FB>
        {/each}
      </FB>
    </FB>
  {/each}
</FB>
