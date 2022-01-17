<script>
  export let lab = ''
  export let expand = false
  let labeled = lab && lab.length > 0
  const c = expand ? 'expand' : ''
</script>

<div class="flexitem {c}">
  {#if labeled}<div class="fi-label">{lab}: </div>{/if}
  <div class="fi-item"><slot></slot></div>
</div>

<style>
  .flexitem {
    display: flex;
    padding-top: 3px;
    padding-bottom: 3px;
    padding-left: 6px;
    padding-right: 6px;
    background-color: #dfdfdf;
    font-family: monospace;
  }
  .expand {
    flex: 1;
  }
  .flexitem:not(:first-child) {
    margin-left: 0.6em;
  }
  .fi-label {
    padding-right: 0.4em;
    font-weight: bold;
  }
  .fi-item {
    width: 100%;
  }
</style>

