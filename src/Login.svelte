<script>
  import Link from './Link.svelte'
  import FB from './FB.svelte'
  import Doc from './doc/Doc.svelte'
  import Line from './doc/Line.svelte'
  import Lab from './doc/Lab.svelte'
  import Input from './doc/Input.svelte'
  import { getContext } from 'svelte'
  const login = getContext('login')
  const register = getContext('register')
  const loc = getContext('loc')
  let handle
  let email
  let pass
  const logw =()=> login({handle, pass})
  const regw =()=> register({handle, email, pass})
  $: doreg = $loc.special == 'register'
</script>

<FB center>
  <Doc w={50}>
    <Line input s="b1">
      <Lab txt="HANDLE"><Input bind:value={handle} /></Lab>
    </Line>
    {#if doreg}
      <Line input s="b1">
        <Lab txt="EMAIL"><Input bind:value={email} /></Lab>
      </Line>
    {/if}
    <Line input s="b1">
      <Lab txt="PASS"><Input bind:value={pass} /></Lab>
    </Line>
    <Line s="s3"/>
    <Line flip s="b2">
      {#if doreg}
        <Link cond={regw} global bounce>REGISTER</Link>
      {:else}
        <Link cond={logw} global bounce>LOGIN</Link>
      {/if}
    </Line>
  </Doc>
</FB>
