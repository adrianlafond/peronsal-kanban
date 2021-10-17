import { writable } from 'svelte/store'
import type { BoardData } from '../services/board-types'
import { getDefaultBoard } from '../services/board-data'

export interface Board {
  markdown: string;
  data: BoardData;
}

export const board = writable<Board>({
  markdown: '# untitled',
  data: getDefaultBoard(),
})
