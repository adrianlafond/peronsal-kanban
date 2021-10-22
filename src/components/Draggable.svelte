<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  let dragging = false
  let startRect: DOMRect
  let el: HTMLDivElement
  const offset = { x: 0, y: 0 }

  function handleMouseDown(event: MouseEvent) {
    dispatch('dragStart', {})
    el = event.currentTarget as HTMLDivElement
    startRect = el.getBoundingClientRect()
    offset.x = event.clientX - startRect.x
    offset.y = event.clientY - startRect.y
    startDragging()
  }

  function handleMouseMove(event: MouseEvent) {
    const x = event.clientX - (startRect.x + offset.x)
    const y = event.clientY - (startRect.y + offset.y)
    el.style.transform = `translate(${x}px, ${y}px)`
  }

  function handleMouseUp(event: MouseEvent) {
    el.style.transform = 'none'
    stopDragging()
  }

  function startDragging() {
    dragging = true
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  function stopDragging() {
    dragging = false
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }
</script>

<div on:mousedown={handleMouseDown}>
  <slot />
</div>
