<script lang="ts">
  import { AccordionItem } from 'carbon-components-svelte'
  import Task from './Task.svelte'
  import type { Project, Status} from '../services/board-data'

  export let project: Project
  export let status: Status

  const tasks = project.tasks.filter(task => task.status === status)

  const style = `background-color: ${project.color};`
</script>

<div class="project">
  <AccordionItem>
    <h5 slot="title" class="project__title" style={style}>
      {project.title}
    </h5>
    {#each tasks as task}
      <Task task={task} />
    {/each}
  </AccordionItem>
</div>

<style>
.project {
  position: relative;
  margin-bottom: 12px;
}
.project__title {
  padding: 0 16px;
  margin: 0 16px 0 -16px;
}
</style>

