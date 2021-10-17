<script lang="ts">
  import { Form, TextInput } from 'carbon-components-svelte'
  import { onDestroy } from 'svelte'
  import { board } from '../stores'
    import { BoardFile, BoardModel } from '../services'
  import FetchBoard from './FetchBoard.svelte'

  let title = ''

  function finishEditing() {
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
    <h3 class="app-header__title-display">
      {title}
    </h3>
    <div class="app-header__title-edit">
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
    </div>
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
  position: relative;
}
.app-header__title-display {
  position: absolute;
  left: 0;
  top: 0;
  height: 3rem; /* matches TextInput XL height */
  line-height: 1.5;
}
.app-header__title-edit {
  opacity: 0;
}
.app-header__title-edit:focus-within {
  opacity: 1;
}
</style>