<script>
  import FB from './FB.svelte'
  import FP from './FP.svelte'
  import PP from './PP.svelte'
  import FR from './FR.svelte'
  import FT from './FT.svelte'
  import Link from './link/Link.svelte'
  import LocRO from './LocRO.svelte'
  import SessRO from './SessRO.svelte'
  import RespRO from './RespRO.svelte'
  import { getContext } from 'svelte'
  const path = getContext('path')
  const stem = getContext('stem')
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
  const modifiers = getContext('modifiers')
  const contcls = getContext('contcls')
  const trail = getContext('trail')
  const scrollinfo = getContext('scrollinfo')
  const state = getContext('state')

  let tab = localStorage.getItem('debugtab') || 'main'
  const go =n=> {
    tab = n
    localStorage.setItem('debugtab', tab)
  }
</script>

<FB>
  <Link nolink does={()=> go('main')} disable={tab == 'main'}>MAIN</Link>
  <Link nolink does={()=> go('rc')} disable={tab == 'rc'}>RC</Link>
  <Link nolink does={()=> go('uc')} disable={tab == 'uc'}>UC</Link>
  <Link nolink does={()=> go('state')} disable={tab == 'state'}>STATE</Link>
  <Link nolink does={()=> go('links')} disable={tab == 'links'}>LINKS</Link>
  <Link nolink does={()=> go('linkmap')} disable={tab == 'linkmap'}>LINKMAP</Link>
  <Link nolink does={()=> go('trail')} disable={tab == 'trail'}>TRAIL</Link>
  <Link nolink does={()=> go('page')} disable={tab == 'page'}>PAGE</Link>
</FB>
{#if tab == 'main'}
<FT>
  <PP lab="path" val={$path} />
  <PP lab="stem" val={$stem} />
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
  <FR lab="scrollinfo">
    <PP lab="ch" val={$scrollinfo.ch} />
    <PP lab="sh" val={$scrollinfo.sh} />
    <PP lab="sy" val={$scrollinfo.sy} />
    <PP lab="scrollable" val={$scrollinfo.scrollable} />
    <PP lab="scrolled" val={$scrollinfo.scrolled} />
  </FR>
  <PP lab="loading" t={v=> !v} val={$loading} />
  <PP lab="space" val={$space} />
  <PP lab="title" val={$title} />
  <FR lab="modifiers">
    <PP lab="shift" val={$modifiers.Shift} />
    <PP lab="ctrl" val={$modifiers.Control} />
    <PP lab="alt" val={$modifiers.Alt} />
  </FR>
</FT>
{:else if tab == 'rc'}
<FT>
  {#each Object.entries($rc) as conf}
    <PP lab={conf[0]} val={conf[1]} />
  {/each}
</FT>
{:else if tab == 'uc'}
<FT>
  {#each Object.entries($uc) as conf}
    <PP lab={conf[0]} val={conf[1]} />
  {/each}
</FT>
{:else if tab == 'state'}
<FT lab={tab}>
  {#each Object.entries($state) as s}
    <PP lab={s[0]} val={s[1]}/>
  {/each}
</FT>
{:else if tab == 'links'}
<FT>
  <PP lab="count" val={$links.length}/>
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
{:else if tab == 'trail'}
<FT lab={tab}>
  {#each $trail as p}
    <PP val={p}/>
  {/each}
</FT>
{:else if tab == 'page'}
<FT>
  {#if !!$page}
  {#each Object.entries($page) as resp}
    {#if resp[0] == 'val'}
      {#each Object.entries(resp[1]) as pair}
        {#if pair[0] == 'body'}
          <PP lab={pair[0]} val={pair[1].slice(0,100)}/>
        {:else}
          <PP lab={pair[0]} val={pair[1]}/>
        {/if}
      {/each}
    {:else}
      <PP lab={resp[0]} val={resp[1]}/>
    {/if}
  {/each}
  {/if}
</FT>
{/if}
