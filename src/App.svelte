<script>
import { onDestroy } from 'svelte';

  import AppHeader from './components/AppHeader.svelte'
  import { board } from './stores'

  export let name

  let markdown = null
  const unsubscribe = board.subscribe(data => {
    markdown = data.markdown
  })

  onDestroy(unsubscribe)
</script>

<main>
  <AppHeader />
  <h1>Hello {name}!</h1>

  <pre>{markdown}</pre>
</main>

<style>
  main {
    width: 100%;
  }
</style>