<script>
  import FP from './FP.svelte'
  import PP from './PP.svelte'
  import FR from './FR.svelte'
  import FT from './FT.svelte'
  import LocRO from './LocRO.svelte'
  import SessRO from './SessRO.svelte'
  import RespRO from './RespRO.svelte'
  import { getContext } from 'svelte'
  const path = getContext('path')
  const hassess = getContext('hassess')
  const haspage = getContext('haspage')
  const hasuser = getContext('hasuser')
  const hashistory = getContext('hashistory')
  const page = getContext('page')
  const user = getContext('user')
  const history = getContext('history')
  const aod = getContext('aod')
  const message = getContext('message')
  const loading = getContext('loading')
  const space = getContext('space')
  const title = getContext('title')
</script>

<FT>
  <PP lab="path" val={$path} />
  <LocRO/>
  <PP lab="hassess" val={$hassess} />
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
