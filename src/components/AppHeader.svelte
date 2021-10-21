<script lang="ts">
  import { Form, TextInput } from 'carbon-components-svelte'
  import { onDestroy } from 'svelte'
  import { board } from '../stores'
    import { BoardFile, BoardModel } from '../services'
  import FetchBoard from './FetchBoard.svelte'

  let title = ''
  let editing = false

  function startEditing() {
    editing = true
  }

  function endEditing(event: Event) {
    editing = false
  }

  function saveEdit(value: string) {
    BoardModel.updateBoardTitle(value || '')
    BoardFile.write()
  }

  function handleEditKeyDown(event: KeyboardEvent) {
    const input = (event.target as HTMLInputElement)
    if (event.key === 'Enter') {
      saveEdit(input.value)
      input.blur()
    } else if (event.key === 'Escape') {
      input.blur()
    }
  }

  function handleTitleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      startEditing()
      event.preventDefault()
    }
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
      <div class="app-header__title-edit">
        <TextInput
          value={title}
          autofocus
          on:blur={endEditing}
          on:keydown={handleEditKeyDown}
          name="board-title"
          size="xl"
        />
      </div>
    {:else}
      <h3
        class="app-header__title-display"
        tabindex={0}
        on:dblclick={startEditing}
        on:keydown={handleTitleKeyDown}
      >
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
  position: relative;
}
.app-header__title-display {
  height: 3rem; /* matches TextInput XL height */
  line-height: 1.5;
  cursor: default;
}
.app-header__title-display:hover {
  background-color: #222a2f;
}
.app-header__title-display:focus {
  background-color: #434a51;
  outline: none;
}
.app-header__title-edit {
  opacity: 0;
}
.app-header__title-edit:focus-within {
  opacity: 1;
}
</style>