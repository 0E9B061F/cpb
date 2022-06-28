<script>
  import Link from './link/Link.svelte'
  import FB from './FB.svelte'

  import { getContext } from 'svelte'
  const page = getContext('page')
  const draft = getContext('draft')
  const postdraft = getContext('postdraft')
  const loc = getContext('loc')

  let body = $page.val ? $page.val.source : ''

  $: $draft = {type: 'page', source: body}
</script>

<FB vert zero form expand c="editor-area">
  <div class="editor-rule"></div>
  <textarea class="main-editor" bind:value={body} spellcheck="false"></textarea>
  <div class="editor-rule bottom-rule"></div>
</FB>
