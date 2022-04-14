<script>
  import FB from '../FB.svelte'
  import Link from '../Link.svelte'
  import Wrapper from '../util/Wrapper.svelte'
  import WUIModule from './WUIModule.svelte'
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
  let c = []
  const mkc =()=> {
    const cb = ['recent-pages']
    if (compact) cb.push('recent-compact')
    c = cb
  }
  $: mkc(compact)
</script>

<WUIModule {c}>
  <svelte:fragment slot="title">{title}</svelte:fragment>
  <svelte:fragment slot="body">
    {#if compact}
      <Wrapper items={recents} line="s1" lines={3} let:item={page}>
        <Link nored space={page.namespace} title={page.title}/>
      </Wrapper>
    {:else}
      {#each recents as page}
        <FB zero vert c="recent-page">
          <FB c="recent-title">
            <Link nored space={page.namespace} title={page.title} />
          </FB>
          <FB c="recent-extra">
            <FB c="recent-date">{fmt(page.createdAt)}</FB>
            <FB c="recent-user">({page.user.handle})</FB>
          </FB>
        </FB>
      {/each}
    {/if}
  </svelte:fragment>
</WUIModule>
