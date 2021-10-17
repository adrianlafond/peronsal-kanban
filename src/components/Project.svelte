<script lang="ts">
  import { Form, TextInput, UnorderedList } from 'carbon-components-svelte'
  import Task from './Task.svelte'
  import { Project, Status, BoardModel, BoardFile } from '../services'

  export let project: Project
  export let status: Status

  const tasks = project.tasks.filter(task => task.status === status)

  const style = `background-color: ${project.color};`

  function endEditing() {
    BoardFile.write()
  }

  function handleInput(event: Event) {
    BoardModel.updateProjectTitle((event.target as HTMLInputElement).value || '', project.id)
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
      <h5 class="project__title-display">
        {project.title}
      </h5>
      <div class="project__title-edit">
        <Form on:submit={handleSubmit}>
          <TextInput
            value={project.title}
            on:input={handleInput}
            on:blur={endEditing}
            name="project-title"
          />
        </Form>
      </div>
    </div>
    <UnorderedList>
      {#each tasks as task (task.id)}
        <Task task={task} projectId={project.id} />
      {/each}
    </UnorderedList>
  </div>
{/if}

<style>
  .project {
    margin: 16px 0;
  }
  .project__title {
    position: relative;
    padding: 4px 0;
    margin: 0 0 4px 0;
  }
  .project__title-display {
    position: absolute;
    left: 16px;
    top: 4px;
    height: 2.5rem; /* matches TextInput height */
    line-height: 2.5;
  }
  .project__title-edit {
    opacity: 0;
  }
  .project__title-edit:focus-within {
    opacity: 1;
  }
</style>

