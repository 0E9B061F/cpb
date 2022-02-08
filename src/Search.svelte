<script>
  import SearchBar from './SearchBar.svelte'
  import { getContext } from 'svelte'
  const loc = getContext('loc')
  let bar
  let result
</script>

<SearchBar
  bind:this={bar}
  bind:result
  query={$loc.query}
/>

{#if result}
  <table class="search-items">
    <tr>
      <th>SPACE</th>
      <th>TITLE</th>
      <th>TEXT</th>
    </tr>
    {#each result as item}
      <tr class="search-item">
        <td>{item.namespace}</td>
        <td>{item.title}</td>
        <td>{item.text}</td>
      </tr>
    {/each}
  </table>
{/if}
