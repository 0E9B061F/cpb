<script>
  import Link from './Link.svelte'
  import { getContext } from 'svelte'
  const login = getContext('login')
  const register = getContext('register')
  let handle
  let pass
  const logw =()=> login({handle, pass})
  const regw =()=> register({handle, pass})
</script>

<input type="text" bind:value={handle} />
<input type="text" bind:value={pass} />
<Link first={logw} global bounce>LOGIN</Link>
<Link first={regw} global bounce>REGISTER</Link>
