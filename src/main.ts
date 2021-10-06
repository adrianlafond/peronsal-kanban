import App from './App.svelte'
import 'carbon-components-svelte/css/g100.css'

import { loadFile } from './services';

const app = new App({
  target: document.body,
  props: {
    name: 'world'
  }
})

const activeFile = localStorage.getItem('activeFile')
if (activeFile) {
  loadFile(activeFile)
}

export default app
