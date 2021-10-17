<script lang="ts">
  import { onDestroy } from 'svelte'
  import { Button, Form, TextInput, UnorderedList } from 'carbon-components-svelte'
  import DocumentAdd20 from 'carbon-icons-svelte/lib/DocumentAdd20'
  import Task from './Task.svelte'
  import { board } from '../stores'
  import { Project, Status, BoardModel, BoardFile } from '../services'

  export let project: Project
  export let status: Status

  const style = `background-color: ${project.color};`
  let tasks = getTasks()
  let adding = false

  function getTasks() {
    return project.tasks.filter(task => task.status === status)
  }

  function endEditingProjectTitle() {
    BoardFile.write()
  }

  function inputProjectTitle(event: Event) {
    BoardModel.updateProjectTitle((event.target as HTMLInputElement).value || '', project.id)
  }

  function submitProjectTitle(event: Event) {
    const form = event.target as HTMLFormElement
    const input = form.querySelector('input[name=project-title]') as HTMLInputElement
    input.blur()
    event.preventDefault()
  }

  function addNewTask() {
    adding = true
  }

  function endAddingTask(event: Event) {
    const input = event.target as HTMLInputElement
    BoardModel.addTask(input.value, status, project.id)
    input.value = ''
    adding = false
  }

  function submitAddTask(event: Event) {
    const form = event.target as HTMLFormElement
    const input = form.querySelector('input[name=new-task]') as HTMLInputElement
    input.blur()
    event.preventDefault()
  }

  onDestroy(board.subscribe(boardData => {
    project = boardData.data.projects.find(p => p.id === project.id) || project
    tasks = getTasks()
  }))
</script>

<!-- svelte-ignore missing-declaration -->
{#if tasks.length}
  <div class="project">
    <div class="project__title" style={style}>
      <h5 class="project__title-display">
        {project.title}
      </h5>
      <div class="project__title-edit">
        <Form on:submit={submitProjectTitle}>
          <TextInput
            value={project.title}
            on:input={inputProjectTitle}
            on:blur={endEditingProjectTitle}
            name="project-title"
          />
        </Form>
      </div>
      <div class="project__new-task-button">
        <Button
          on:click={addNewTask}
          icon={DocumentAdd20}
          iconDescription="Add new task"
          size="small"
          kind="ghost"
        />
      </div>
    </div>
    {#if adding}
      <Form on:submit={submitAddTask}>
        <TextInput
          labelText="New task"
          placeholder="title"
          name="new-task"
          autofocus
          on:blur={endAddingTask}
        />
      </Form>
    {/if}
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
    display: flex;
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
    flex-grow: 1;
  }
  .project__title-edit:focus-within {
    opacity: 1;
  }
  .project__new-task-button {
    display: flex;
  }
</style>

