<script lang="ts">
  import Task from './Task.svelte'
  import type { Project, Status} from '../services/board-data'

  export let project: Project
  export let status: Status

  const tasks = project.tasks.filter(task => task.status === status)

  const style = `background-color: ${project.color};`
</script>

<div class="project">
  {#if project.color}
    <div class="project__background" style={style} />
  {/if}
  <div class="project__content">
    <h5>{project.title}</h5>
    {#each tasks as task}
      <Task task={task} />
    {/each}
  </div>
</div>

<style>
.project {
  position: relative;
  margin: 8px 0 0 0;
  padding: 8px;
  border: 1px solid #393939;
  background-color: #262626;
}
.project__dragging {
  z-index: 1;
}

.project__background {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.25;
}
.project__content {
  position: relative;
}
</style>

