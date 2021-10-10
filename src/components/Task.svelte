<script lang="ts">
  import type { Task } from '../services/board-data'
  import Draggable from './Draggable.svelte'

  export let task: Task

  function handleDragStart() {
    console.log('dragStart');
  }
</script>

<Draggable on:dragStart={handleDragStart}>
  <div class="task">
    <p>{task.title}</p>
  </div>
</Draggable>

<style>
.task {
  margin: 8px 0 0 0;
  /* padding: 8px; */
  border: 1px solid #393939;
  background-color: #161616;
  cursor: default;
}
</style>
