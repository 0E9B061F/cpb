<script>
  import Link from './Link.svelte'
  import UUID from './UUID.svelte'
  import Balance from './Balance.svelte'
  import { getContext } from 'svelte'
  const gs = getContext('gs')
  export let item
</script>

<tr class="history-item">
  <td class="history-num">{item.vnum}</td>
  <td class="history-title">{item.title}</td>
  <td class="history-vuuid">
    <Balance right><Link uuid={item.vuuid}><UUID>{item.vuuid}</UUID></Link></Balance>
  </td>
</tr>
