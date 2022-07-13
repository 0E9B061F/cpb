<script>
  import Generic from './util/Generic.svelte'
  import FB from './FB.svelte'

  import { getContext } from 'svelte'
  const rc = getContext('rc')
  const loc = getContext('loc')
  const haslogin = getContext('haslogin')
  const state = getContext('state')
  const component = getContext('component')
  let c = []
  const classify =()=> {
    c = []
    if ($loc.nullpage) {
      c.push('special-page')
      c.push(`${$loc.title}-special`)
    } else {
      c.push('content-page')
      c.push(`namespace-${$loc.namespace}`)
    }
  }
  $: classify($loc)
</script>

<FB vert expand {c}>
  {#if !$state.loading}<Generic cmp={$component}/>{/if}
</FB>
