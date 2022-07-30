<script>
  import Link from './link/Link.svelte'
  import FB from './FB.svelte'
  import Text from './doc/Text.svelte'

  import { getContext } from 'svelte'

  const page = getContext('page')
  const haspage = getContext('haspage')
  const draft = getContext('draft')
  const postdraft = getContext('postdraft')
  const loc = getContext('loc')


  const dotype =()=> {
    if ($haspage) {
      return $page.val.resource.type
    } else if ($loc.special?.type) {
      return $loc.special.type
    } else {
      return 'page'
    }
  }


  let type = dotype()
  let body = $haspage ? $page.val.source : ''
  let files

  const mkdraft =()=> {
    if (type == 'image') {
      const fd = new FormData()
      fd.append('type', type)
      fd.append('source', body)
      if (file) fd.append('image', file)
      return fd
    } else {
      return {type, source: body}
    }
  }

  $: file = files && files[0] ? files[0] : null
  $: $draft = mkdraft(type, body, file)
</script>



<FB vert zero form expand c="editor-area">
  {#if $loc.special}
    <FB rel c="alert">
      <FB fw={9} center c="icon">
        NB
      </FB>
      <FB vert zero>
        <FB vc para="s1" fw={7}>RESERVED LOCATION</FB>
        <FB vc para="s1">The system uses this location to {$loc.special.purpose}. A <strong>{$loc.special.type}</strong> is expected.</FB>
      </FB>
    </FB>
  {/if}
  <div class="editor-rule"></div>
  <textarea class="main-editor" bind:value={body} spellcheck="false"></textarea>
  <div class="editor-rule bottom-rule"></div>
  <FB c="editor-module">
    {#if $haspage}
      <FB expand fw={6}>{$page.val.resource.type.toUpperCase()}</FB>
    {:else if $loc.special?.type}
      <FB expand fw={6}>{$loc.special.type.toUpperCase()}</FB>
    {:else}
      <FB expand><Link nolink does={()=> type = 'page'} disable={type == 'page'}>PAGE</Link> &middot; <Link nolink does={()=> type = 'image'} disable={type == 'image'}>IMAGE</Link> &middot; <Link nolink does={()=> type = 'directory'} disable={type == 'directory'}>DIRECTORY</Link></FB>
    {/if}
    {#if type == 'image'}
      <input type="file" name="image" bind:files>
    {/if}
  </FB>
</FB>
