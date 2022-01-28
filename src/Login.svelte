<script>
  import Link from './Link.svelte'
  import { getContext } from 'svelte'
  const login = getContext('login')
  const register = getContext('register')
  let handle
  let email
  let pass
  const logw =()=> login({handle, pass})
  const regw =()=> register({handle, email, pass})
</script>

<input type="text" bind:value={handle} />
<input type="text" bind:value={email} />
<input type="text" bind:value={pass} />
<Link cond={logw} global bounce>LOGIN</Link>
<Link cond={regw} global bounce>REGISTER</Link>
