<script>
  import {getContext} from 'svelte'
  const gs = getContext('gs')
 
  export let href = '/'
  export let title = undefined
  
  const clicked =()=> {
    $gs.path = href
  }
</script>

{#if $gs.path == href}
  <span class="current-link"><slot></slot></span>
{:else}
  <a {href} {title} on:click|preventDefault={clicked}><slot></slot></a>
{/if}

<style>
  a {
    color: #6e7fd2;
  }
</style>

