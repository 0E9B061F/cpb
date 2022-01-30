<script>
  import FB from './FB.svelte'
  import Link from './Link.svelte'
  import { getContext } from 'svelte'
  const grab = getContext('grab')
  const handle = getContext('handle')
  const aod = getContext('aod')
  export let count = null
  let recents = []
  const refresh =()=> {
    const a = ['recent']
    if (count) a.push(count)
    return grab(...a).then(res=> {
      if (res.err == 0) recents = res.val
    })
    .catch(e=> handle(e))
  }
  $: refresh($aod, count)
</script>

<FB vert c="recent-pages">
  {#each recents as page}
    <FB vert c="recent-page">
      <FB c="recent-title"><Link space={page.namespace} title={page.title}>{page.title}</Link></FB>
      <FB c="recent-user">BY: {page.user.handle}</FB>
    </FB>
  {/each}
</FB>
