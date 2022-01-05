<script>
  import {getContext} from 'svelte'
  import SvelteMarkdown from 'svelte-markdown'
  const gs = getContext('gs')
  $: source = xxx($gs.path)
  const xxx =path=> {
    return `
  # This is '${path}'

[HOME](/)

* This is a list
* With two items
  1. And a sublist
  2. That is ordered
    * With another
    * Sublist inside

| And this is | A table |
|-------------|---------|
| With two    | columns |`
  }
</script>

<SvelteMarkdown {source} />

<style>
</style>

