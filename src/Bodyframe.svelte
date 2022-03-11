<script>
  import Login from './Login.svelte'
  import User from './User.svelte'
  import Test from './special/Test.svelte'
  import TestForms from './special/TestForms.svelte'
  import TestLinks from './special/TestLinks.svelte'
  import E401 from './E401.svelte'
  import E404 from './E404.svelte'
  import E500 from './E500.svelte'
  import Content from './Content.svelte'
  import Search from './Search.svelte'
  import FB from './FB.svelte'

  import { getContext } from 'svelte'
  const rc = getContext('rc')
  const loc = getContext('loc')
  const haslogin = getContext('haslogin')
  let c = []
  const classify =()=> {
    c = []
    if ($loc.namespace == $rc.syskey) c.push('special-page')
    c.push(`${$loc.title}-special`)
  }
  $: classify($loc)
  import { onMount } from 'svelte'
  onMount(()=> console.log('baz!!!'))
</script>

<FB vert expand {c}>
  {#if $loc.namespace == $rc.syskey}
    {#if $loc.title == 'login' || $loc.title == 'register'}
      {#if !$haslogin}
        <Login/>
      {:else}
        <E401/>
      {/if}
    {:else if $loc.title == 'user'}
      {#if $haslogin}
        <User/>
      {:else}
        <E401/>
      {/if}
    {:else if $loc.title == 'search'}
      <Search/>
    {:else if $loc.title == 'test'}
      <Test/>
    {:else if $loc.title == 'forms'}
      <TestForms/>
    {:else if $loc.title == 'links'}
      <TestLinks/>
    {/if}
  {:else}
    <Content/>
  {/if}
</FB>
