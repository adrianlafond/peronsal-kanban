<script lang="ts">
  import { onDestroy } from 'svelte'
  import AppHeader from './components/AppHeader.svelte'
  import Board from './components/Board.svelte'
  import { Selection } from './services'

  onDestroy(Selection.instance.destroy)
</script>

<main>
  <AppHeader />
  <Board />
</main>

<style>
  main {
    width: 100%;
  }
</style>