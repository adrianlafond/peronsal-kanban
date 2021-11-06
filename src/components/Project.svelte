<script lang="ts">
  import { onDestroy } from 'svelte'
  import { Button, Form, TextInput, UnorderedList } from 'carbon-components-svelte'
  import DocumentAdd20 from 'carbon-icons-svelte/lib/DocumentAdd20'
  import Draggable from './Draggable.svelte'
  import Task from './Task.svelte'
  import { board } from '../stores'
  import { Project, Status, BoardModel, BoardFile, TaskData } from '../services'

  export let project: Project
  export let status: Status

  const style = `background-color: ${project.color};`
  let tasks = getTasks()
  let editing = false
  let adding = false
  let dragging = false

  function getTasks() {
    return project.tasks.filter(task => task.status === status)
  }

  function startEditing() {
    editing = true
  }

  function endEditing() {
    editing = false
  }

  function saveProjectTitle(value: string) {
    const newValue = value.trim()
    if (newValue) {
      BoardModel.updateProjectTitle(newValue, project.id)
      BoardFile.write()
    }
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
      saveProjectTitle(input.value || '')
      input.blur()
    } else if (event.key === 'Escape') {
      input.blur()
    }
  }

  function addNewTask() {
    adding = true
  }

  function endAdding(event: Event) {
    adding = false
  }

  function handleAddingKeyDown(event: KeyboardEvent) {
    const input = (event.target as HTMLInputElement)
    if (event.key === 'Enter') {
      saveNewTask(input.value || '')
      input.value = ''
      input.blur()
    } else if (event.key === 'Escape') {
      input.blur()
    }
  }

  function saveNewTask(value: string) {
    const trimmedValue = value.trim()
    if (trimmedValue) {
      BoardModel.addTask(trimmedValue, status, project.id)
    }
  }

  function handleDragStart() {
    dragging = true
  }

  function handleDragEnd(event: Event) {
    dragging = false
    const data: TaskData = (event as DragEvent).detail as unknown as TaskData;
    BoardModel.moveProject(project, data, status)
    // BoardFile.write()
  }

  onDestroy(board.subscribe(boardData => {
    project = boardData.data.projects.find(p => p.id === project.id) || project
    tasks = getTasks()
  }))
</script>

<!-- svelte-ignore missing-declaration -->
{#if tasks.length}
  <Draggable on:dragStart={handleDragStart} on:dragEnd={handleDragEnd}>
  <div
    class="project"
    data-kanban-type="project"
    data-kanban-project={project.id}
    data-kanban-status={status}
  >
    <div class="project__title" style={style}>
      {#if editing}
        <div class="project__title-edit">
          <TextInput
            value={project.title}
            autofocus
            tabindex={0}
            on:blur={endEditing}
            on:keydown={handleEditKeyDown}
            name="project-title"
          />
        </div>
      {:else}
        <h5
          class="project__title-display"
          tabindex={0}
          on:dblclick={startEditing}
          on:keydown={handleTitleKeyDown}
        >
          {project.title}
        </h5>
      {/if}
      <div class="project__new-task-button">
        <Button
          on:click={addNewTask}
          icon={DocumentAdd20}
          iconDescription="Add new task"
          size="small"
          kind="ghost"
          disabled={adding}
        />
      </div>
    </div>
    {#if adding}
      <TextInput
        labelText="New task"
        placeholder="title"
        name="new-task"
        autofocus
        on:blur={endAdding}
        on:keydown={handleAddingKeyDown}
      />
    {/if}
    <UnorderedList>
      {#each tasks as task (task.id)}
        <Task task={task} projectId={project.id} />
      {/each}
    </UnorderedList>
  </div>
  </Draggable>
{/if}

<style>
  .project {
    margin: 16px 0;
  }
  .project__title {
    position: relative;
    padding: 4px 0;
    margin: 0 0 4px 0;
    display: flex;
  }
  .project__title-display {
    flex-grow: 1;
    margin: 0 0 0 16px;
    height: 2.5rem; /* matches TextInput height */
    line-height: 2.5;
    cursor: default;
  }

  .project__title-edit {
    flex-grow: 1;
  }
  .project__new-task-button {
    display: flex;
  }
</style>

