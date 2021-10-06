<script>
	import { Button, TextInput, InlineLoading } from 'carbon-components-svelte'
	import { files } from '../stores'

	let status = 'open'
	let canLoad = false

	const { activeFile: file, loading, error } = $files

	function openBoard() {
		status = 'input'
	}

	function onInputKeydown(event) {
		if (event.key === 'Escape') {
			reset();
		}
	}

	function onInput(event) {
		canLoad = !!event.target.value
	}

	function loadBoard() {
		console.log('load')
	}

	function reset() {
		status = 'open'
	}
</script>

<div class="fetch-board">
	{#if loading}
		<div class="fetch-board__align fetch-board__loading">
			<div>
				<InlineLoading />
			</div>
			<p>Loading <em>{file}</em></p>
		</div>
	{:else if error}
		<div class="fetch-board__align">
			<p>{error}</p>
			<Button on:click={reset}>OK</Button>
		</div>
	{:else if status === 'open' && !!file }
		<Button on:click={openBoard} kind="tertiary">
			Change Board
		</Button>
	{:else if status === 'open' && !file }
		<Button on:click={openBoard}>
			open Board
		</Button>
	{:else if status === 'input'}
		<form class="fetch-board__align" on:submit={loadBoard}>
			<TextInput
				value={file || ''}
				autofocus
				placeholder="Absolute path"
				on:keydown={onInputKeydown}
				on:input={onInput}
			/>
			<div class="fetch-board__button">
				<Button class="personal-kanban__fetch-board-input-form-button" type="submit" disabled={!canLoad}>Load</Button>
			</div>
			<div class="fetch-board__button">
				<Button class="personal-kanban__fetch-board-input-form-button" on:click={reset} kind="tertiary">Cancel</Button>
			</div>
		</form>
	{/if}
</div>

<style>
	.fetch-board {
		flex-grow: 0.5;
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