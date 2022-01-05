<script>
  import {getContext} from 'svelte'
  const gs = getContext('gs')
 
  export let href = '/'
  export let title = undefined
  
  const clicked =()=> {
    $gs.path = href
  }
</script>

<a {href} {title} on:click|preventDefault={clicked}><slot></slot></a>

