import { writable } from 'svelte/store'

// TODO: add files [] and activeFileIndex
export interface BoardFiles {
  activeFile: string | null
  loading: string | null
  error: string | null
}

export const boardFiles = writable<BoardFiles>({
  activeFile: localStorage.getItem('activeFile') || null,
  loading: null,
  error: null,
})
