<script lang="ts">
  import { Form, TextInput, UnorderedList } from 'carbon-components-svelte'
  import Task from './Task.svelte'
  import type { Project, Status} from '../services/board-data'
  import { BoardModel } from '../services/board-model'
  import { BoardFile } from '../services/board-file'

  export let project: Project
  export let status: Status

  const tasks = project.tasks.filter(task => task.status === status)

  const style = `background-color: ${project.color};`

  let editing = false

  function makeEditable() {
    editing = true
  }

  function finishEditing() {
    editing = false
    BoardFile.write()
  }

  function handleInput(event: Event) {
    BoardModel.updateProjectTitle(project.title, (event.target as HTMLInputElement).value || '')
  }

  function handleSubmit(event: Event) {
    const form = event.target as HTMLFormElement
    const input = form.querySelector('input[name=project-title]') as HTMLInputElement
    input.blur()
    event.preventDefault()
  }
</script>

<!-- svelte-ignore missing-declaration -->
{#if tasks.length}
  <div class="project">
    <div class="project__title" style={style}>
      {#if editing}
        <Form on:submit={handleSubmit}>
          <TextInput
            autofocus
            value={project.title}
            on:input={handleInput}
            on:blur={finishEditing}
            name="project-title"
          />
        </Form>
      {:else}
        <h5 on:dblclick={makeEditable} class="project__title-display">
          {project.title}
        </h5>
      {/if}
    </div>
    <UnorderedList>
    {#each tasks as task}
      <Task task={task} />
    {/each}
    </UnorderedList>
  </div>
{/if}

<style>
  .project {
    margin: 16px 0;
  }
  .project__title {
    padding: 4px 16px;
    margin: 0 16px 4px -16px;
  }
  .project__title-display {
    cursor: default;
    user-select: none;
    height: 2.5rem; /* matches TextInput height */
    line-height: 2.5;
  }
</style>

