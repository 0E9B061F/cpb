<script>
  import FB from './FB.svelte'
  import FP from './FP.svelte'
  import PP from './PP.svelte'
  import FR from './FR.svelte'
  import FT from './FT.svelte'
  import Link from './Link.svelte'
  import LocRO from './LocRO.svelte'
  import SessRO from './SessRO.svelte'
  import RespRO from './RespRO.svelte'
  import { getContext } from 'svelte'
  const path = getContext('path')
  const hassess = getContext('hassess')
  const haslogin = getContext('haslogin')
  const haspage = getContext('haspage')
  const hasuser = getContext('hasuser')
  const hashistory = getContext('hashistory')
  const creating = getContext('creating')
  const editing = getContext('editing')
  const page = getContext('page')
  const user = getContext('user')
  const history = getContext('history')
  const aod = getContext('aod')
  const message = getContext('message')
  const loading = getContext('loading')
  const space = getContext('space')
  const title = getContext('title')
  const rc = getContext('rc')
  const uc = getContext('uc')
  const links = getContext('links')
  const linkmap = getContext('linkmap')

  let tab = 'main'
  const go =n=> tab = n
</script>

<FB>
  <Link nolink does={()=> go('main')} disable={tab == 'main'}>MAIN</Link>
  <Link nolink does={()=> go('rc')} disable={tab == 'rc'}>RC</Link>
  <Link nolink does={()=> go('uc')} disable={tab == 'uc'}>UC</Link>
  <Link nolink does={()=> go('links')} disable={tab == 'links'}>LINKS</Link>
  <Link nolink does={()=> go('linkmap')} disable={tab == 'linkmap'}>LINKMAP</Link>
</FB>
{#if tab == 'main'}
<FT lab={tab}>
  <PP lab="path" val={$path} />
  <LocRO/>
  <PP lab="creating" val={$creating} />
  <PP lab="editing" val={$editing} />
  <PP lab="hassess" val={$hassess} />
  <PP lab="haslogin" val={$haslogin} />
  <SessRO/>
  <RespRO lab="page" h={$haspage} r={$page}/>
  <RespRO lab="user" h={$hasuser} r={$user}/>
  <RespRO lab="history" h={$hashistory} r={$history}/>
  <PP lab="AOD" t={v=> v > 0} val={$aod} />
  <FR lab="message">
    <PP lab="level" val={$message.level} />
    <PP lab="text" val={$message.text} />
  </FR>
  <PP lab="loading" t={v=> !v} val={$loading} />
  <PP lab="space" val={$space} />
  <PP lab="title" val={$title} />
</FT>
{:else if tab == 'rc'}
<FT lab={tab}>
  {#each Object.entries($rc) as conf}
    <PP lab={conf[0]} val={conf[1]} />
  {/each}
</FT>
{:else if tab == 'uc'}
<FT lab={tab}>
  {#each Object.entries($uc) as conf}
    <PP lab={conf[0]} val={conf[1]} />
  {/each}
</FT>
{:else if tab == 'links'}
<FT lab={tab}>
  {#each $links as link}
    <PP val={link}/>
  {/each}
</FT>
{:else if tab == 'linkmap'}
<FT lab={tab}>
  {#each Object.entries($linkmap) as link}
    <PP lab={link[0]} val={link[1]}/>
  {/each}
</FT>
{/if}
