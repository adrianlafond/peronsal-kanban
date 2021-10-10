<script>
  import { onDestroy } from 'svelte';
  import { board } from '../stores'
  import FetchBoard from './FetchBoard.svelte'

  let title = ''
  const unsubscribe = board.subscribe(boardData => {
    document.title = title = boardData.data.title
  })

  onDestroy(unsubscribe)
</script>

<div class="app-header">
  <h3 class="app-header__title">{title}</h3>
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
</style>