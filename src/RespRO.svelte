<script>
  import FP from './FP.svelte'
  import FR from './FR.svelte'
  import PP from './PP.svelte'
  export let lab
  export let h
  export let r
</script>

<PP lab="has{lab}" val={h} />
{#if h}
  <FR {lab}>
    <PP lab="err" t={v=> v == 0} val={r.err} />
    {#if r.msg}
      <PP lab="msg" val={r.msg} />
    {/if}
    <PP lab="val" val={!!r.val} />
  </FR>
{:else}
  <PP {lab} val={r} />
{/if}
