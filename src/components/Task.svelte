<script lang="ts">
  import { onDestroy } from 'svelte'
  import { ListItem, TextInput } from 'carbon-components-svelte'
  import classNames from 'classnames'
  import { Task, BoardModel, BoardFile, TaskData, Selection } from '../services'
  import { board, selected } from '../stores'
  import Draggable from './Draggable.svelte'

  export let task: Task
  export let projectId: string | null = null

  let editing = false
  let dragging = false
  let isSelected = false

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

  function handleDragEnd(event: Event) {
    dragging = false
    BoardModel.moveTask(task, (event as DragEvent).detail as unknown as TaskData)
    BoardFile.write()
  }

  function handleTitleSelect() {
    if (task.id) {
      Selection.instance.selectTask(task)
    }
  }

  function getTitleDisplayClass() {
    return classNames('task__title-display', {
      'task__title-display--project': projectId,
      'task__title-display--selected': isSelected,
    })
  }
  let titleClass = getTitleDisplayClass()

  const unsubscribeFromBoard = board.subscribe(boardData => {
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

  const unsubscribeFromSelected = selected.subscribe(selectedData => {
    isSelected = selectedData.tasks.some(selectedTask => selectedTask === task.id)
    titleClass = getTitleDisplayClass()
  })

  onDestroy(() => {
    unsubscribeFromBoard()
    unsubscribeFromSelected()
  })
</script>

<!-- svelte-ignore missing-declaration -->
<Draggable
  taskId={task.id}
  on:dragStart={handleDragStart}
  on:dragEnd={handleDragEnd}
>
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
          class={titleClass}
          tabindex={0}
          on:dblclick={startEditing}
          on:keydown={handleTitleKeyDown}
          on:mousedown={handleTitleSelect}
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
  .task__title-display--selected,
  .task__title-display--selected:hover {
    background-color: #434a51;
  }
  .task__title-display:focus {
    color: #f1c21b;
    outline: none;
  }
  .task__title-display--project {
    padding-left: 16px;
  }
  .task__title-edit {
    margin-left: 0;
  }
</style>
