<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte'
  import type { Status, TaskData } from '../services'
  import { selected } from '../stores'

  export let projectId: string | null = null;
  export let taskId: string | null = null;

  const dispatch = createEventDispatcher()

  let dragging = false
  let startRect: DOMRect
  let el: HTMLDivElement

  const offset = { x: 0, y: 0 }
  const startScroll = { x: 0, y: 0 }
  const dropData: TaskData = {
    status: null,
    project: null,
    task: null,
  }

  function handleMouseDown(event: MouseEvent) {
    event.stopImmediatePropagation()

    resetDropData()
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    selected.update(data => ({
      ...data,
      dragging: event,
    }))
  }

  function handleMouseMove(event: MouseEvent) {
    selected.update(data => ({
      ...data,
      dragging: event,
    }))
    updateDropPosition()
  }

  function handleMouseUp(event: MouseEvent) {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
    selected.update(data => ({
      ...data,
      dragging: null,
    }))
  }

  function startDragging(clientX: number, clientY: number) {
    startRect = el.getBoundingClientRect()
    offset.x = clientX - startRect.x
    offset.y = clientY - startRect.y
    startScroll.x = window.scrollX
    startScroll.y = window.scrollY
    dragging = true
    dispatch('dragStart')
  }

  // Update drag's object's position, accounting for offset and page scroll.
  function drag(x: number, y: number) {
    if (dragging) {
      x -= startRect.x + offset.x - (window.scrollX - startScroll.x)
      y -= startRect.y + offset.y - (window.scrollY - startScroll.y)
      el.style.transform = `translate(${x}px, ${y}px)`
    } else {
      startDragging(x, y)
    }
  }

  function stopDragging() {
    dragging = false
    if (el) {
      el.style.transform = 'none'

      // Check if the drop target task is the same task that is being dragged.
      if (el?.firstChild) {
        const childNode = el?.firstChild as HTMLElement
        if (childNode.getAttribute('data-kanban-type') === 'task' && childNode.getAttribute('data-kanban-task') === dropData.task) {
          resetDropData()
        }
      }

      dispatch('dragEnd', dropData)
    } else {
      window.setTimeout(stopDragging, 0)
    }
  }

  // Finds the drag object's potential new status and project if dropped.
  function updateDropPosition() {
    const elRect= el.getBoundingClientRect()
    const statusEl = getCurrentStatus(elRect)
    if (statusEl) {
      dropData.status = statusEl?.getAttribute('data-kanban-status') as Status
      const elChild = el.firstChild as HTMLElement
      if (elChild.getAttribute('data-kanban-type') === 'project') {
        const projectEl = getProjectBefore(statusEl, elRect, elChild)
        dropData.project = projectEl?.getAttribute('data-kanban-project') || null
      } else {
        // If not a project, must be a task.
        const taskEl = getTaskBefore(statusEl, elRect, elChild)
        dropData.project = taskEl?.getAttribute('data-kanban-project') || null
        dropData.task = taskEl?.getAttribute('data-kanban-task') || null
      }
    } else {
      resetDropData()
    }
  }

  function resetDropData() {
      dropData.status = null
      dropData.project = null
      dropData.task = null
  }

  // Returns the element for the board status that the drag object is currently
  // being dragged over, or else null.
  function getCurrentStatus(elRect: DOMRect) {
    const statusEls = document.querySelectorAll('[data-kanban-type="status"]')
    for (let i = 0; i < statusEls.length; i++) {
      const statusRect = statusEls[i].getBoundingClientRect()
      const statusMidX = statusRect.left + statusRect.width / 2
      const matchX = elRect.left <= statusMidX && elRect.right >= statusMidX
      const matchY = matchX && ((elRect.bottom >= statusRect.top && elRect.top < statusRect.bottom)
        || (elRect.top <= statusRect.bottom && elRect.bottom > statusRect.top))
      if (matchY) {
        return statusEls[i]
      }
    }
    return null
  }

  function getProjectBefore(statusEl: Element, elRect: DOMRect, dragEl: HTMLElement) {
    return getItemBefore(statusEl, elRect, dragEl, 'project')
  }

  function getTaskBefore(statusEl: Element, elRect: DOMRect, dragEl: HTMLElement) {
    return getItemBefore(statusEl, elRect, dragEl, 'task')
  }

  function getItemBefore(statusEl: Element, elRect: DOMRect, dragEl: HTMLElement, type: 'task' | 'project') {
    const els = statusEl.querySelectorAll(`[data-kanban-type="${type}"]`)
    let dropEl: Element | null = null;
    for (let i = 0; i < els.length; i++) {
      if (els[i] === dragEl) {
        continue
      }
      const itemRect = els[i].getBoundingClientRect()
      if (elRect.top >= itemRect.top) {
        dropEl = els[i]
      }
    }
    return dropEl
  }

  onDestroy(selected.subscribe(selectedData => {
    if (taskId && selectedData.tasks.includes(taskId)) {
      if (selectedData.dragging) {
        drag(selectedData.dragging.clientX, selectedData.dragging.clientY)
      } else {
        stopDragging()
      }
    }
  }))
</script>

<div
  bind:this={el}
  on:mousedown={handleMouseDown}
  class={`draggable${dragging ? ' draggable--dragging' : ''}`}
>
  <slot />
</div>

<style>
  .draggable {
    position: relative;
    transition: transform 0.15s ease-out;
  }
  .draggable--dragging {
    z-index: 100;
    transition: none;
  }
</style>