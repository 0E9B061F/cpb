<script>
  import signature from '../../../lib/signature.js'
  import FB from '../../FB.svelte'
  import Telescope from '../../util/Telescope.svelte'
  import Separated from '../../util/Separated.svelte'
  import Srclet from './Srclet.svelte'

  import { getContext } from 'svelte'
  const addSource = getContext('addSource')
  const loc = getContext('loc')

  export let args

  $: sig = signature.consume(args, 'ident')
  $: src = addSource(sig.get('ident'))
  $: id = `source-${sig.get('ident')}`
  $: targets = src.targets
  $: current = $loc.cmd?.startsWith(id)
</script>

<div class="source system" class:current={current} {id}>
  <Telescope items={targets}>
    <div class="source-info"><slot></slot></div>
    <Separated items={src.citations} let:item={cite}>
      <Srclet {cite}/>
    </Separated>
  </Telescope>
</div>
