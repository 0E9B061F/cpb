<script>
  import Link from '../link/Link.svelte'
  import FB from '../FB.svelte'
  import Text from '../doc/Text.svelte'
  import { getContext } from 'svelte'

  const login = getContext('login')
  const register = getContext('register')
  const loc = getContext('loc')

  let handle
  let email
  let pass

  const logw =()=> login(handle, pass)
  const regw =()=> register(handle, email, pass)

  $: doreg = $loc.title == 'register'
</script>

<FB center>
  <FB tag="form" vert w={50} lw={5} c="login-form">
    <FB line="b3">
      <Text required lab="HANDLE" bind:value={handle}/>
    </FB>
    {#if doreg}
      <FB line="b3">
        <Text required type="email" lab="EMAIL" bind:value={email}/>
      </FB>
    {/if}
    <FB line="b3">
      <Text required type="password" lab="PASS" bind:value={pass}/>
    </FB>
    <FB spacer="3"/>
    <FB flip line="b3">
      {#if doreg}
        <Link cond={regw} global>REGISTER</Link>
      {:else}
        <Link cond={logw} global>LOGIN</Link>
      {/if}
    </FB>
  </FB>
</FB>
