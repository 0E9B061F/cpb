<script>
  import Link from './link/Link.svelte'
  import UUID from './UUID.svelte'
  import Balance from './Balance.svelte'
  import { getContext } from 'svelte'
  const gs = getContext('gs')
  export let item
</script>

<tr class="history-item">
  <td class="history-num">{item.number}</td>
  <td class="history-user"><Link user={item.editor}/></td>
  <td class="history-title">{item.title}</td>
  <td class="history-vuuid grow">
    <Balance right><Link uuid={item.uuid}><UUID>{item.uuid}</UUID></Link></Balance>
  </td>
</tr>
