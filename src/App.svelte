<script lang="ts">
	import AppHeader from './components/AppHeader.svelte'
	export let name: string
</script>

<main>
	<AppHeader />
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<style>
	main {
		width: 100%;
	}
</style>