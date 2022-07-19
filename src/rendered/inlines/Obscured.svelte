<script>
  import ClickCopy from  '../../util/ClickCopy.svelte'
  import util from '../../../lib/util.js'
  export let text
  let split, handle, domain, last, rest, obscured
  const shatter =(s)=> {
    const i = util.rint(0, s.length-1)
    return [s.slice(0,i), util.stamp(3), s.slice(i,s.length)]
  }
  const parse =()=> {
    split = text.split('@')
    handle = split[0]
    domain = split[1].split('.')
    last = domain[0]
    rest = domain.slice(1)
    obscured = [
      shatter(handle),
      '@',
      shatter(last),
      `.${rest.join('.')}`
    ]
  }
  $: parse(text)
</script>

<ClickCopy copy={text}>
  {#each obscured as part}
    {#if typeof(part) == 'string'}<span class="ov">{part}</span>{:else}<span class="ov">{part[0]}</span><span class="oo">{part[1]}</span><span class="ov">{part[2]}</span>{/if}
  {/each}
</ClickCopy>
