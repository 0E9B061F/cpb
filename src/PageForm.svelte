<script>
  import Link from './Link.svelte'
  import FB from './FB.svelte'

  import { getContext } from 'svelte'
  const page = getContext('page')
  const draft = getContext('draft')
  const postdraft = getContext('postdraft')
  const loc = getContext('loc')

  let namespace = $page.val ? $page.val.namespace : $loc.namespace
  let title = $page.val ? $page.val.title : $loc.title
  let body = $page.val ? $page.val.body : ''

  $: $draft = {namespace, title, body}
</script>

<FB vert zero form expand c="editor-area">
  <div class="editor-rule"></div>
  <textarea class="main-editor" bind:value={body} spellcheck="false"></textarea>
  <div class="editor-rule bottom-rule"></div>
</FB>
