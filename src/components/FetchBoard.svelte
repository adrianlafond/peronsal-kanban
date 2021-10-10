<script lang="ts">
  import { Button, TextInput, InlineLoading } from 'carbon-components-svelte'
  import { boardFiles, BoardFiles } from '../stores'
  import { loadFile, resetFilesLoading } from '../services'
  import { onDestroy } from 'svelte';

  let status = 'open'
  let canLoad = false
  let inputEl: HTMLInputElement

  let file: BoardFiles['activeFile']
  let loading: BoardFiles['loading']
  let error: BoardFiles['error']
  const unsubscribe = boardFiles.subscribe(files => {
    file = files.activeFile
    loading = files.loading
    error = files.error
    canLoad = !!file
    if (loading) {
      status = 'open'
    }
  });
  onDestroy(unsubscribe)

  function openBoard() {
    status = 'input'
  }

  function onInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      reset();
      event.preventDefault()
    }
  }

  function onInput(event: InputEvent) {
    canLoad = !!(event.target as HTMLInputElement).value
  }

  function loadBoard(event: Event) {
    loadFile(inputEl.value)
    event.preventDefault()
    return false
  }

  function reset() {
    resetFilesLoading()
    status = 'open'
  }
</script>

<div class="fetch-board">
  {#if error}
    <div class="fetch-board__align">
      <p>{error}</p>
      <div class="fetch-board__button">
        <Button on:click={reset} size="field">OK</Button>
      </div>
    </div>
  {:else if loading}
    <div class="fetch-board__align fetch-board__loading">
      <div>
        <InlineLoading />
      </div>
      <p>Loading <em>{file}</em></p>
    </div>
  {:else if status === 'open' && !!file }
    <Button on:click={openBoard} size="field" kind="tertiary">
      Change Board
    </Button>
  {:else if status === 'open' && !file }
    <Button on:click={openBoard} size="field">
      open Board
    </Button>
  {:else if status === 'input'}
    <form class="fetch-board__align" on:submit={loadBoard}>
      <TextInput
        value={file || ''}
        autofocus
        placeholder="/enter/an/absolute/path/to/kanban.md"
        bind:ref={inputEl}
        on:keydown={onInputKeydown}
        on:input={onInput}
      />
      <div class="fetch-board__button">
        <Button class="personal-kanban__fetch-board-input-form-button" size="field" type="submit" disabled={!canLoad}>
          Load
        </Button>
      </div>
      <div class="fetch-board__button">
        <Button class="personal-kanban__fetch-board-input-form-button" size="field" on:click={reset} kind="tertiary">
          Cancel
        </Button>
      </div>
    </form>
  {/if}
</div>

<style>
  .fetch-board {
    flex-grow: 1;
    text-align: right;
  }

  .fetch-board__button {
    margin-left: 4px;
  }

  .fetch-board__loading {
    margin-right: 12px;
  }

  .fetch-board__align {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>