<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  function onMouseDown(event: MouseEvent) {
    dispatch('dragStart', {})
  }
</script>

<div on:mousedown={onMouseDown}>
  <slot />
</div>
