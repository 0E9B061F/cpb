<script>
  import FB from '../FB.svelte'
  import Link from '../Link.svelte'
  import Wrapper from '../util/Wrapper.svelte'
  import WUIModule from './WUIModule.svelte'
  export let items
</script>

<WUIModule>
  <svelte:fragment slot="title">
    BOOKMARKS
  </svelte:fragment>
  <svelte:fragment slot="body">
    <Wrapper {items} line="s1" lines={3} let:item={nst}>
      <Link {nst}/>
    </Wrapper>
  </svelte:fragment>
</WUIModule>
