<script>
  import FB from '../../FB.svelte'
  export let args = []
  $: id = args[0]
  $: text = args.slice(1).join(' ')
</script>

<div {id}>{text}<slot></slot></div>
