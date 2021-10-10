<script lang="ts">
  import type { Task } from '../services/board-data'

  export let task: Task
</script>

<div class="task">
  <p>{task.title}</p>
</div>

<style>
.task {
  margin: 8px 0 0 0;
  padding: 8px;
  border: 1px solid #393939;
  background-color: #161616;
}
</style>
