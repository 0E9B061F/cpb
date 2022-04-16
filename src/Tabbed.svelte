<script>
  import Link from './link/Link.svelte'
  import FB from './FB.svelte'
  let slot
</script>

<FB>
{#each Object.keys($$slots) as slot}
  <Link nolink>{slot}</Link>
{/each}
</FB>
{#each Object.keys($$slots) as slot}
  <slot name={slot}></slot>
{/each}
