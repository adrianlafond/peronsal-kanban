<script lang="ts">
  import { onDestroy } from 'svelte'
  import { ListItem, Form, TextInput } from 'carbon-components-svelte'
  import { Task, BoardModel, BoardFile } from '../services'
  import { board } from '../stores'
  import Draggable from './Draggable.svelte'

  export let task: Task
  export let projectId: string | null = null

  function endEditing(event: Event) {
    saveEdit((event.target as HTMLInputElement).value || '')
  }

  function handleSubmit(event: Event) {
    const form = event.target as HTMLFormElement
    const input = form.querySelector('input[name=task-title]') as HTMLInputElement
    input.blur()
    event.preventDefault()
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

  function handleDragStart() {
    console.log('dragStart')
  }

  function cancelEditByEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      const input = event.target as HTMLInputElement
      input.value = ''
      input.blur()
      input.value = task.title
    }
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
<Draggable on:dragStart={handleDragStart}>
  <ListItem>
    <div class="task__title">
      <div class={`task__title-display${projectId ? ' task__title-display--project': ''}`}>
        {task.title}
      </div>
      <div class="task__title-edit">
        <Form on:submit={handleSubmit}>
          <TextInput
            value={task.title}
            on:blur={endEditing}
            on:keydown={cancelEditByEscape}
            name="task-title"
            size="sm"
          />
        </Form>
      </div>
    </div>
  </ListItem>
</Draggable>

<style>
  .task__title {
    position: relative;
  }
  .task__title-display {
    position: absolute;
    left: 0;
    top: 0;
    height: 2rem; /* matches TextInput SM height */
    line-height: 2;
  }
  .task__title-display--project {
    margin-left: 16px;
  }
  .task__title-edit {
    margin-left: 0;
    opacity: 0;
  }
  .task__title-edit:focus-within {
    opacity: 1;
  }
</style>
