<script>
  import FB from '../FB.svelte'
  import Link from '../link/Link.svelte'
  import { getContext } from 'svelte'
  const msg = getContext('msg')
  export let key
  const copykey =()=> {
    navigator.clipboard.writeText(key)
    msg('COPIED PGP KEY')
  }
</script>

<figure>
<FB center c="pgp-key">
  <div class="figcontent">
    <pre><span class="pgp-header">-----BEGIN PGP PUBLIC KEY BLOCK-----</span>{key}<span class="pgp-header">-----END PGP PUBLIC KEY BLOCK-----</span></pre>
    <div class="figcontrols">
      <Link nolink does={copykey}>COPY</Link>
    </div>
  </div>
</FB>
</figure>
