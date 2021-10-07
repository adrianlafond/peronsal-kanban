import { writable } from 'svelte/store';
import { getDefaultBoard, BoardData } from '../services';

export interface Board {
  markdown: string;
  data: BoardData
}

export const board = writable<Board>({
  markdown: '# untitled',
  data: getDefaultBoard(),
});
