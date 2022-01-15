<script>
  import Link from './Link.svelte'
  import { getContext, onDestroy } from 'svelte'
  const gs = getContext('gs')
  let handle
  let pass
  const login =()=> {
    return fetch($gs.cmd('login'), {
      method: 'POST',
      body: JSON.stringify({handle, pass}),
      headers: {'Content-Type': 'application/json'},
    }).then(res=> {
      $gs.refreshuser()
      $gs.msg(`Logged in as '${handle}'`)
    })
  }
  const register =()=> {
    return fetch($gs.cmd('register'), {
      method: 'POST',
      body: JSON.stringify({handle, pass}),
      headers: {'Content-Type': 'application/json'},
    }).then(res=> {
      $gs.refreshuser()
      $gs.msg(`Registered as '${handle}'`)
    })
  }
</script>

<input type="text" bind:value={handle} />
<input type="text" bind:value={pass} />
<Link first={login} global bounce>LOGIN</Link>
<Link first={register} global bounce>REGISTER</Link>

