<script lang="ts">
  import { UnorderedList } from 'carbon-components-svelte'
  import { onDestroy } from 'svelte'
  import Project from './Project.svelte'
  import Task from './Task.svelte'
  import { board } from '../stores'
  import type { Project as ProjectType, Task as TaskType, Status } from '../services/board-data'

  export let status: Status

  function getStatusTitle() {
    switch (status) {
      case 'backlog':
        return 'Backlog'
      case 'todo':
        return 'To Do'
      case 'doing':
        return 'Doing'
      case 'done':
        return 'Done'
      case 'archive':
        return 'Archive'
      default:
        return 'Backlog'
    }
  }

  let tasks: TaskType[] = []
  let projects: ProjectType[] = []

  const unsubscribe = board.subscribe(boardData => {
    tasks = boardData.data.tasks.filter(task => task.status === status)
    projects = boardData.data.projects
  })

  onDestroy(unsubscribe)
</script>

<!-- svelte-ignore missing-declaration -->
<div class="board-status">
  <h4>{getStatusTitle()}</h4>
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
}
.board-status__tiles {
  padding: 8px 8px 0 0;
}
</style>