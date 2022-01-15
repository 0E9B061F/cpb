<script>
  export let lab = ''
  let labeled = lab && lab.length > 0
</script>

<div class="flexitem">
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
  .flexitem:not(:first-child) {
    margin-left: 0.6em;
  }
  .fi-label {
    padding-right: 0.4em;
    font-weight: bold;
  }
  .fi-item {
  }
</style>

