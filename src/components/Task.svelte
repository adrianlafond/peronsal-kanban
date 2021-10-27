<script lang="ts">
  import { onDestroy } from 'svelte'
  import { ListItem, Form, TextInput } from 'carbon-components-svelte'
  import { Task, BoardModel, BoardFile } from '../services'
  import { board } from '../stores'
  import Draggable from './Draggable.svelte'

  export let task: Task
  export let projectId: string | null = null

  let editing = false
  let dragging = false

  function startEditing() {
    editing = true
  }

  function endEditing() {
    editing = false
  }

  function saveEdit(value: string) {
    const newValue = value.trim()
    if (newValue) {
      if (projectId) {
        BoardModel.updateProjectTaskTitle(newValue, projectId, task.id)
      } else {
        BoardModel.updateBoardTaskTitle(newValue, task.id)
      }
    }
    BoardFile.write()
  }

  function handleTitleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      startEditing()
      event.preventDefault()
    }
  }

  function handleEditKeyDown(event: KeyboardEvent) {
    const input = (event.target as HTMLInputElement)
    if (event.key === 'Enter') {
      saveEdit(input.value || '')
      input.blur()
    } else if (event.key === 'Escape') {
      input.blur()
    }
  }

  function handleDragStart() {
    dragging = true
  }

  function handleDragEnd() {
    dragging = false
  }

  const unsubscribe = board.subscribe(boardData => {
    if (projectId) {
      task = boardData.data.projects
        .find(data => data.id === projectId)
        ?.tasks.find(data => data.id === task.id)
        || task
    } else {
      boardData.data.tasks.some(task => {
        if (task.id === task.id) {
          task = task
        }
        return false
      })
    }
  })

  onDestroy(unsubscribe)
</script>

<!-- svelte-ignore missing-declaration -->
<Draggable on:dragStart={handleDragStart} on:dragEnd={handleDragEnd}>
  <ListItem
    data-kanban-type="task"
    data-kanban-project={projectId}
    data-kanban-task={task.id}
    data-kanban-status={task.status}
  >
    <div class="task__title">
      {#if editing}
        <div class="task__title-edit">
          <TextInput
            value={task.title}
            autofocus
            on:blur={endEditing}
            on:keydown={handleEditKeyDown}
            name="task-title"
            size="sm"
          />
        </div>
      {:else}
        <p
          class={`task__title-display${projectId ? ' task__title-display--project': ''}`}
          tabindex={0}
          on:dblclick={startEditing}
          on:keydown={handleTitleKeyDown}
        >
          {task.title}
        </p>
      {/if}
    </div>
  </ListItem>
</Draggable>

<style>
  .task__title {
    position: relative;
  }
  .task__title-display {
    margin: 0;
    height: 2rem; /* matches TextInput SM height */
    line-height: 2;
    cursor: default;
  }
  .task__title-display:hover {
    background-color: #222a2f;
  }
  .task__title-display:focus {
    background-color: #434a51;
    outline: none;
  }
  .task__title-display--project {
    padding-left: 16px;
  }
  .task__title-edit {
    margin-left: 0;
  }
</style>
