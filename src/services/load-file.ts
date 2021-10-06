import { BOARD_URL } from './endpoints'
import { BoardFiles, boardFiles } from '../stores'

/**
 * Loads a text file that is intended to be a markdown file in custom kanban format.
 */
export function loadFile(file: string) {
  boardFiles.update((files: BoardFiles) => ({ ...files, loading: true, error: null }))
  fetch(
    BOARD_URL,
    {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ file }),
    },
  ).then((response: Response) => {
    if (response.ok) {
      response.text().then(file => {
        boardFiles.update((files: BoardFiles) => ({ ...files, file, loading: false, error: null }))
      })
    } else {
      boardFiles.update((files: BoardFiles) => ({
        ...files,
        loading: false,
        error: 'An error occurred! File not found.',
      }))
    }
  }).catch((error: Error) => {
    boardFiles.update((files: BoardFiles) => ({ ...files, loading: false, error: error.message }))
  })
}

export function resetFilesLoading() {
  boardFiles.update((files: BoardFiles) => ({ ...files, loading: false, error: null }))
}
