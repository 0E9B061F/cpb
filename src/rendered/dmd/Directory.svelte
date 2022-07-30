<script>
  import { getContext } from 'svelte'
  const menu = getContext('menu')
</script>


<ul class="directory root system" class:menu={menu}>
  <slot></slot>
</ul>
