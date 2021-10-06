<script lang="ts">
	import { Button } from 'carbon-components-svelte'

	function openBoard() {
		console.log('open board');
	}
</script>

<div class="fetch-board">
  <Button on:click={openBoard}>Open Board</Button>
</div>

<style>
.fetch-board {
  /**/
}
</style>