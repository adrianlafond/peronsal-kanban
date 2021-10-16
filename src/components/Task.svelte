<script lang="ts">
  import { onDestroy } from 'svelte'
  import { ListItem, Form, TextInput } from 'carbon-components-svelte'
  import type { Task } from '../services/board-data'
  import { BoardModel } from '../services/board-model'
  import { BoardFile } from '../services/board-file'
  import { board } from '../stores'
  import Draggable from './Draggable.svelte'

  export let task: Task
  export let project: string | null = null

  let editing = false

  function makeEditable() {
    editing = true
  }

  function finishEditing() {
    editing = false
    BoardFile.write()
  }

  function handleInput(event: Event) {
    const newValue = (event.target as HTMLInputElement).value || ''
    if (project) {
      console.log('handleInput()', task.title)
      BoardModel.updateProjectTaskTitle(project, task.title, newValue)
    } else {
      BoardModel.updateBoardTaskTitle(task.title, newValue)
    }
  }

  function handleSubmit(event: Event) {
    const form = event.target as HTMLFormElement
    const input = form.querySelector('input[name=task-title]') as HTMLInputElement
    input.blur()
    event.preventDefault()
  }

  function handleDragStart() {
    console.log('dragStart')
  }

  const unsubscribe = board.subscribe(boardData => {
    if (project) {
      task = boardData.data.projects
        .find(data => data.title === project)
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
      {#if editing}
        <div class="task__title-form">
          <Form on:submit={handleSubmit}>
            <TextInput
              autofocus
              value={task.title}
              on:input={handleInput}
              on:blur={finishEditing}
              name="task-title"
              size="sm"
            />
          </Form>
        </div>
      {:else}
        <div on:dblclick={makeEditable} class="task__title-display">
          {task.title}
        </div>
      {/if}
    </div>
  </ListItem>
</Draggable>

<style>
  .task__title {
    padding: 0 16px 0 0;
  }
  .task__title-form {
    margin-left: -16px;
  }
  .task__title-display {
    cursor: default;
    user-select: none;
    height: 2rem; /* matches TextInput SM height */
    line-height: 2;
  }
</style>
