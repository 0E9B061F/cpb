<script>
  import Link from './Link.svelte'
  import {getContext} from 'svelte'
  const gs = getContext('gs')
  export let item
  $: href = `/_/${item.vuuid}`
</script>

<Link {href}>
  <div class="history-item">
    <span class="history-num">{item.vnum}</span>
    <span class="history-title">{item.title}</span>
    <span class="history-vuuid">{item.vuuid}</span>
  </div>
</Link>

