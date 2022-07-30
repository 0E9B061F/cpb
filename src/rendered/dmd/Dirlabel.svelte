<script>
  import Link from '../../link/Link.svelte'
  import { getContext } from 'svelte'

  let fold = getContext('fold')
  const toggle = getContext('toggle')

  const click =()=> toggle()
</script>

<span class="dir-label"><span class="bullet">{#if $fold}▸{:else}▾{/if}</span>&nbsp;<Link nolink does={click}><slot></slot></Link></span>
