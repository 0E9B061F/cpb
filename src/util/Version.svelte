<script>
  import dt from 'date-and-time'

  export let name = false
  export let version = false
  export let hash = false
  export let series = false
  export let date = false
  export let env = false

  export let short = false

  const hd = dt.format(new Date(__CPB_DATE), 'YYYY-MM-DD')
  $: handle = short ? __CPB_SHORT : __CPB_NAME
  const ver = __CPB_REMAINDER ? `${__CPB_VERSION}.${__CPB_RELEASE}` : __CPB_VERSION
</script>

<span class="cpb-info">
  {#if name}<span class="cpb-name">{handle}</span>{/if}
  {#if version}<span class="cpb-version">{ver}</span>{/if}
  {#if hash}<span class="cpb-hash">({__CPB_HASH})</span>{/if}
  {#if series}'<span class="cpb-series">{__CPB_SERIES}</span>'{/if}
  {#if date}<span class="cpb-date">built {hd}</span>{/if}
  {#if env}<span class="cpb-env">{__CPB_ENV}</span>{/if}
</span>
