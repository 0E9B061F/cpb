<script>
	import QR from './QR.svelte'
	import Link from './link/Link.svelte'
	import FB from './FB.svelte'
	import Strike from './util/Strike.svelte'
	import UUID from './UUID.svelte'
	import Logo from './Logo.svelte'
	import Bookmarks from './Bookmarks.svelte'
	import UserBar from './UserBar.svelte'
	import TitleControls from './TitleControls.svelte'
	import Messenger from './Messenger.svelte'
	import SearchBar from './SearchBar.svelte'
	import Separated from './util/Separated.svelte'

  import { getContext } from 'svelte'
	import { Fortune } from '../lib/fortune.mjs'

  const gs = getContext('gs')
  const path = getContext('path')
  const loc = getContext('loc')
  const session = getContext('session')
  const hassess = getContext('hassess')
  const haspage = getContext('haspage')
  const state = getContext('state')
  const ui = getContext('ui')
  const rc = getContext('rc')

	const ideograms = new Fortune([
		'𐃐', '𐂂', '𐃥', '𐂅',
		'𐂐',  '𐁃', '𐁙', '𐁉',
	])
	$: ideogram = ideograms.get($loc)
</script>

<FB vert c="head-frame">

	{#if $ui <= 1}
		<FB line="s2">
			{#if $rc.bookmarks.length}
				<Separated line="s2" fw={6} items={$rc.bookmarks} let:item={item}>
					<Link nst={item}/>
				</Separated>
			{/if}
			<FB line="s2" c="fill" expand/>
		</FB>
	{/if}

	<FB>
		{#if $ui <= 1}
			<FB vert zero>
				<FB expand c="logobase fill"></FB>
				<div class="logocorner fill">{ideogram}</div>
			</FB>
			<FB vert zero>
				<Logo/>
				<UserBar mini generic/>
			</FB>
		{:else}
			<div class="logocorner fill">{ideogram}</div>
			<Logo/>
		{/if}

		<FB expand vert zero>
			<FB expand c={$ui <= 1 ? "base-head-upper" : ''}>
				<FB ve>
					{#if !$state.uuid && $state.namespace && $state.title && !($state.namespace == $rc.syskey && !$haspage)}
	      		<FB title line="s2" fw={6} c="title-sub">
							<Link space={$state.namespace}/>
						</FB>
					{/if}
				</FB>
				<FB expand/>
				<FB vert center>
					<FB line="s2"><Messenger/></FB>
				</FB>
				{#if $ui <= 1}<SearchBar preview auto inf="title" szOpt={5}/>{/if}
			</FB>

			<FB between>
				<FB title line="b3" fw={8} c="title-main">
					{#if $state.uuid}
						<UUID>{$state.uuid}</UUID>
					{:else if $state.namespace == $rc.syskey && !$haspage}
						<div class="system-title">{$state.title}</div>
					{:else}
						{$state.title || $state.namespace}
					{/if}
				</FB>
				<FB vert end>
					<TitleControls/>
				</FB>
			</FB>
		</FB>
	</FB>

</FB>
