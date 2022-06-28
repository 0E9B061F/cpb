<script>
	import FB from './FB.svelte'
	import Link from './link/Link.svelte'
	import Pipe from './Pipe.svelte'
	import MaybeUUID from './MaybeUUID.svelte'
	import Version from './util/Version.svelte'
  import { getContext } from 'svelte'
  const page = getContext('page')
  const haspage = getContext('haspage')
  const editing = getContext('editing')
  const creating = getContext('creating')
  const postdraft = getContext('postdraft')
  const state = getContext('state')
  const rc = getContext('rc')
</script>

<FB vert c="footer">
	<FB c="footer-top">
	  <FB vert center>
			{#if $state.content}
				<FB>
					<MaybeUUID right uuid={$page.val.resource.uuid}/>
					<FB vert center><span class="foot-label">RSRC</span></FB>
				</FB>
				<FB>
					<MaybeUUID right uuid={$page.val.prevUuid}/>
					<FB vert center><span class="foot-label">PREV</span></FB>
				</FB>
			{:else}
				<FB c="foot-controls" expand end/>
			{/if}
	  </FB>
	  <FB expand vert center>
	    <div class="heartmark">&#x2764;</div>
	  </FB>
	  <FB vert center>
			{#if $state.creating || $state.editing}
				<FB c="foot-controls" expand end>
					<FB vert center>
						{#if $state.creating}
							<Link self global first={postdraft}>CREATE</Link>
						{:else if $state.editing}
							<Link self global first={postdraft} opt={{edit: undefined}}>SAVE</Link>
						{/if}
					</FB>
				</FB>
			{:else if $state.content}
				<FB>
					<FB vert center><span class="foot-label">VERS</span></FB>
					<MaybeUUID left uuid={$page.val.uuid}/>
				</FB>
				<FB>
					<FB vert center><span class="foot-label">NEXT</span></FB>
					<MaybeUUID left uuid={$page.val.nextUuid}/>
				</FB>
			{:else}
				<FB c="foot-controls" expand end/>
			{/if}
	  </FB>
  </FB>
	<FB between c="footer-bottom">
		<FB line="s3" ghost><Version version series date/></FB>
		<FB line="s3"><span class="textmark">{$rc.title}</span> powered by <Version name/></FB>
		<FB line="s3"><Version version series date/></FB>
	</FB>
</FB>
