<script>
  import FB from './FB.svelte'
  export let lab = null
  export let t = null
  export let val
  export let c = []
  const type =v=> {
    let t
    if (typeof(v) == 'boolean') t = v ? 'true' : 'false'
    else if (v === null) t = 'null'
    else if (typeof(v) == 'string') {
      if (v.length) t = 'string-full'
      else t = 'string-empty'
    } else t = typeof(v)
    return t
  }
  $: state = t ? type(t(val)) : type(val)
  if (typeof(c) == 'string') c = c.split(' ')
  c.push('fp-pair')
  c.push('fp-cond')
  $: cc = [...c, 'pp-'+state]
</script>

<FB c={cc}>
  {#if lab}<div class="fp-label">{lab}:</div>{/if}
  <div class="fp-item">{JSON.stringify(val)}</div>
</FB>
