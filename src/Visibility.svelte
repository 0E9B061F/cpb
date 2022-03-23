<script>
  import FB from './FB.svelte'
  import { setContext,onMount, onDestroy, createEventDispatcher } from 'svelte'
  import { writable } from 'svelte/store'

  const dispatch = createEventDispatcher()
  export let ghost = false
  let watcher
  let watched
  let visible = writable(true)
  setContext('visible', visible)

  onMount(()=> {
    watcher = new IntersectionObserver((entries, obs)=> {
      const ir = entries[entries.length-1].intersectionRatio
      const vis = ir >= 1
      if (vis && !$visible) dispatch('visible', true)
      if (!vis && !!$visible) dispatch('visible', false)
      $visible = vis
    }, {
      rootMargin: '0px',
      threshold: 0.99,
    })
    watcher.observe(watched)
  })

  onDestroy(()=> {
    watcher.disconnect()
  })
</script>

<div class="visibility-wrapper"
  class:visfull={!!$visible}
  class:vispart={!$visible}
  class:ghost={ghost && !$visible}
  bind:this={watched}>
  <slot></slot>
</div>
