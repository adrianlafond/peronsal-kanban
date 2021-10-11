<script lang="ts">
  import { ListItem } from 'carbon-components-svelte'
  import type { Task } from '../services/board-data'
  import Draggable from './Draggable.svelte'

  export let task: Task

  function handleDragStart() {
    console.log('dragStart');
  }
</script>

<Draggable on:dragStart={handleDragStart}>
  <ListItem>
    {task.title}
  </ListItem>
</Draggable>

<style>
</style>
