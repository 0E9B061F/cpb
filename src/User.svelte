<script>
  import {getContext} from 'svelte'
  const gs = getContext('gs')
  const session = getContext('session')
  let user = {}
  $: if ($session.user) {
    let url = $gs.cmd('user', '/'+$session.user.handle)
    fetch(url).then(res=> res.json()).then(res=> user = res)
  }
</script>

<h1>{user.handle}</h1>

<p>Circa {user.createdAt}</p>
