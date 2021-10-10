import { BOARD_URL } from './endpoints'
import { board, Board, BoardFiles, boardFiles } from '../stores'
import { toBoardData } from './board-data'

/**
 * Loads a text file that is intended to be a markdown file in custom kanban format.
 */
export function loadFile(file: string) {
  boardFiles.update((files: BoardFiles) => ({ ...files, loading: file, error: null }))
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
      response.text().then(markdown => {
        board.update((board: Board) => ({
          ...board,
          markdown,
          data: toBoardData(markdown),
        }))
        boardFiles.update((files: BoardFiles): BoardFiles => ({
          ...files,
          activeFile: file,
          loading: null,
          error: null,
        }))
        localStorage.setItem('activeFile', file)
      })
    } else {
      boardFiles.update((files: BoardFiles): BoardFiles => ({
        ...files,
        loading: null,
        error: 'An error occurred! File not found.',
      }))
    }
  }).catch((error: Error) => {
    boardFiles.update((files: BoardFiles): BoardFiles => ({ ...files, loading: null, error: error.message }))
  })
}

export function resetFilesLoading() {
  boardFiles.update((files: BoardFiles): BoardFiles => ({ ...files, loading: null, error: null }))
}
