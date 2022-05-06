<script>
  import FB from '../FB.svelte'
  import Link from '../link/Link.svelte'
  import Wrapper from '../util/Wrapper.svelte'
  import WUIModule from './WUIModule.svelte'
  import { getContext } from 'svelte'
  const rc = getContext('rc')
  export let items = null
  let marks
  $: if (items && items.length) {
    marks = items
  } else {
    marks = $rc.bookmarks
  }
</script>

{#if marks.length}
  <WUIModule>
    <svelte:fragment slot="title">
      BOOKMARKS
    </svelte:fragment>
    <svelte:fragment slot="body">
      <Wrapper items={marks} line="s1" lines={3} let:item={nst}>
        <Link {nst}/>
      </Wrapper>
    </svelte:fragment>
  </WUIModule>
{/if}
