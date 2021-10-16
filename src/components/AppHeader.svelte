<script lang="ts">
  import { Form, TextInput } from 'carbon-components-svelte'
  import { onDestroy } from 'svelte'
  import { board } from '../stores'
    import { BoardFile, BoardModel } from '../services'
  import FetchBoard from './FetchBoard.svelte'

  let title = ''
  let editing = false

  function makeEditable() {
    editing = true
  }

  function finishEditing() {
    editing = false
    BoardFile.write()
  }

  function handleInput(event: Event) {
    BoardModel.updateBoardTitle((event.target as HTMLInputElement).value || '')
  }

  function handleSubmit(event: Event) {
    const form = event.target as HTMLFormElement
    const input = form.querySelector('input[name=board-title]') as HTMLInputElement
    input.blur()
    event.preventDefault()
  }

  const unsubscribe = board.subscribe(boardData => {
    title = boardData.data.title
    document.title = title
  })

  onDestroy(unsubscribe)
</script>

<!-- svelte-ignore missing-declaration -->
<div class="app-header">
  <div class="app-header__title">
    {#if editing}
      <Form on:submit={handleSubmit}>
        <TextInput
          autofocus
          value={title}
          on:input={handleInput}
          on:blur={finishEditing}
          name="board-title"
          size="xl"
        />
      </Form>
    {:else}
      <h3 on:dblclick={makeEditable} class="app-header__title-display">
        {title}
      </h3>
    {/if}
  </div>
  <FetchBoard />
</div>

<style>
.app-header {
  width: 100%;
  padding: 12px;
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px dotted #8d8d8d;
}
.app-header__title {
  flex-grow: 1;
}
.app-header__title-display {
  cursor: default;
  user-select: none;
  height: 3rem; /* matches TextInput XL height */
  line-height: 1.5;
}
</style>