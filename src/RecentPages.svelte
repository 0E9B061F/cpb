<script>
  import FB from './FB.svelte'
  import Link from './Link.svelte'
  import date from 'date-and-time'
  import { getContext } from 'svelte'
  const grab = getContext('grab')
  const handle = getContext('handle')
  const aod = getContext('aod')
  export let count = null
  export let compact = false
  export let title = compact ? 'RECENT' : 'RECENT PAGES'
  let recents = []
  const refresh =()=> {
    const a = ['recent']
    if (count) a.push(count)
    return grab(...a).then(res=> {
      if (res.err == 0) recents = res.val
    })
    .catch(e=> handle(e))
  }
  const fmt =s=> {
    const d = new Date(s)
    return date.format(d, 'ddd, MMM DD YYYY')
  }
  $: refresh($aod, count)
</script>

<FB vert c="recent-pages">
  {#if title}
    <FB line="b2" fw={7}>{title}</FB>
  {/if}
  {#if compact}
    <FB>
    {#each recents as page, i}
      {#if i > 0}<span>&middot;</span>{/if}
      <Link nored space={page.namespace} title={page.title} />
    {/each}
    </FB>
  {:else}
    {#each recents as page}
      <FB zero vert c="recent-page">
        <FB c="recent-title">
          <Link nored space={page.namespace} title={page.title} />
        </FB>
        <FB>
          <FB c="recent-date">{fmt(page.createdAt)}</FB>
          <FB c="recent-user">({page.user.handle})</FB>
        </FB>
      </FB>
    {/each}
  {/if}
</FB>
