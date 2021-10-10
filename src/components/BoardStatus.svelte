<script>
  import { onDestroy } from 'svelte'
  import { Tile } from 'carbon-components-svelte'
  import Project from './Project.svelte'
  import { board } from '../stores'

  export let status

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

  let tasks = []
  let projects = []

  function onTilesMouseDown(event) {
    console.log(event)
  }

  const unsubscribe = board.subscribe(boardData => {
    tasks = boardData.data.tasks.filter(task => task.status === status)
    projects = boardData.data.projects
  })

  onDestroy(unsubscribe)
</script>

<div class="board-status">
  <h4>{getStatusTitle()}</h4>
  <div class="board-status__tiles" on:mousedown={onTilesMouseDown}>
    {#each tasks as task, index}
      <Tile data-task={index}>{task.title}</Tile>
    {/each}
    {#each projects as project}
      <Project status={status} project={project} />
    {/each}
  </div>
</div>

<style>
.board-status {
  flex-grow: 1;
  min-width: 320px;
}
.board-status__tiles {
  padding: 8px 8px 0 0;
}
</style>