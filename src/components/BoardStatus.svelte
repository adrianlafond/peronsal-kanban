<script lang="ts">
  import { Form, Button, TextInput, UnorderedList } from 'carbon-components-svelte'
  import DocumentAdd20 from 'carbon-icons-svelte/lib/DocumentAdd20'
  import FolderAdd20 from 'carbon-icons-svelte/lib/FolderAdd20'
  import { onDestroy } from 'svelte'
  import Project from './Project.svelte'
  import Task from './Task.svelte'
  import { board } from '../stores'
  import { BoardModel } from '../services/board-model'
  import type { Project as ProjectType, Task as TaskType, Status } from '../services/board-types'

  export let status: Status

  function getStatusTitle() {
    switch (status) {
      case 'todo':
        return 'To Do'
      case 'doing':
        return 'Doing'
      case 'done':
        return 'Done'
      case 'archive':
        return 'Archive'
      default:
        return 'To Do'
    }
  }

  let tasks: TaskType[] = []
  let projects: ProjectType[] = []
  let adding: 'task' | 'project' | null = null

  function addNewTask() {
    adding = 'task'
  }

  function addNewProject() {
    adding = 'project'
  }

  function endAdding(event: Event) {
    (event.target as HTMLInputElement).value = ''
    adding = null
  }

  function handleAddingKeyDown(event: KeyboardEvent) {
    const input = (event.target as HTMLInputElement)
    if (event.key === 'Enter') {
      saveNewItem(input.value || '')
      input.blur()
    } else if (event.key === 'Escape') {
      input.blur()
    }
  }

  function saveNewItem(value: string) {
    const trimmedValue = value.trim()
    if (trimmedValue) {
      if (adding === 'task') {
        BoardModel.addTask(trimmedValue, status)
      } else if (adding === 'project') {
        BoardModel.addProject(trimmedValue, status)
      }
    }
  }

  onDestroy(board.subscribe(boardData => {
    tasks = boardData.data.tasks.filter(task => task.status === status)
    projects = boardData.data.projects
  }))
</script>

<!-- svelte-ignore missing-declaration -->
<div class="board-status">
  <div class="board-status__title">
    <h4 class="board-status__title-display">{getStatusTitle()}</h4>
    <div>
      <Button
        on:click={addNewTask}
        icon={DocumentAdd20}
        iconDescription="Add new task"
        size="small"
        kind="ghost"
        disabled={adding}
      />
      <Button
        on:click={addNewProject}
        icon={FolderAdd20}
        iconDescription="Add new project"
        size="small"
        kind="ghost"
        disabled={adding}
      />
    </div>
  </div>
  {#if adding}
    <TextInput
      labelText={`New ${adding}`}
      placeholder="title"
      name="new-item"
      autofocus
      on:blur={endAdding}
      on:keydown={handleAddingKeyDown}
    />
  {/if}
  <div class="board-status__tiles">
    {#if tasks.length}
      <UnorderedList>
        {#each tasks as task (task.id)}
          <Task task={task} />
        {/each}
      </UnorderedList>
    {/if}
    {#each projects as project (project.id)}
      <Project status={status} project={project} />
    {/each}
  </div>
</div>

<style>
.board-status {
  flex: 1 1 0;
  min-width: 320px;
  padding-right: 16px;
}
.board-status__title {
  display: flex;
}
.board-status__title-display {
  flex-grow: 1;
}
.board-status__tiles {
  padding: 8px 8px 0 0;
}
</style>