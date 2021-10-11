<script lang="ts">
  import { AccordionItem, UnorderedList } from 'carbon-components-svelte'
  import Task from './Task.svelte'
  import type { Project, Status} from '../services/board-data'

  export let project: Project
  export let status: Status

  const tasks = project.tasks.filter(task => task.status === status)

  const style = `background-color: ${project.color};`
</script>

{#if tasks.length}
  <AccordionItem open>
    <h5 slot="title" class="project__title" style={style}>
      {project.title}
    </h5>
    <UnorderedList>
    {#each tasks as task}
      <Task task={task} />
    {/each}
    </UnorderedList>
  </AccordionItem>
{/if}

<style>
.project__title {
  padding: 0 16px;
  margin: 0 16px 0 -16px;
}
</style>

