import App from './App.svelte'
import 'carbon-components-svelte/css/g100.css'

import { BoardFile } from './services'

const app = new App({ target: document.body })

const activeFile = localStorage.getItem('activeFile')
if (activeFile) {
  BoardFile.read(activeFile)
}

export default app
