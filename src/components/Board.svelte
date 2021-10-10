<script lang="ts">
  import BoardStatus from './BoardStatus.svelte'
</script>

<div class="board">
  <BoardStatus status="backlog" />
  <BoardStatus status="todo" />
  <BoardStatus status="doing" />
  <BoardStatus status="done" />
</div>

<style>
.board {
  display: flex;
  flex-wrap: wrap;
  padding: 12px;
}
</style>