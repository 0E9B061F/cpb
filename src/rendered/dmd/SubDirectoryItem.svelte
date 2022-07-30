<script>
  import { getContext, setContext } from 'svelte'
  import { outclick } from "../../../lib/outclick.js"
  import { writable } from 'svelte/store'

  const menu = getContext('menu')
  const menuopen = getContext('menuopen')
  const fold = writable(menu)
  const sdiroot = getContext('sdiroot')
  const root = !sdiroot

  const children = []

  const register =(sdi)=> {
    children.push(sdi)
  }

  const unfold =()=> {
    if ($fold) {
      if (menu && root) menuopen(refold)
      $fold = false
    }
    return $fold
  }
  const refold =()=> {
    if (!$fold) {
      children.forEach(c=> c())
      $fold = true
    }
    return $fold
  }
  const toggle =()=> $fold ? unfold() : refold()

  if (root) setContext('sdiroot', register)
  else sdiroot(refold)

  setContext('toggle', toggle)
  setContext('refold', refold)
  setContext('fold', fold)

  const autoclose =()=> {
    refold()
  }
</script>

{#if root && !$fold}
<li class="subdir item" class:fold={$fold} class:unfold={!$fold} use:outclick on:outclick={autoclose}><slot></slot></li>
{:else}
<li class="subdir item" class:fold={$fold} class:unfold={!$fold}><slot></slot></li>
{/if}
