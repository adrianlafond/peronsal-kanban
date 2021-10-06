import { writable } from 'svelte/store';

export interface Board {
  markdown: string;
}

export const boards = writable<Board>({
  markdown: '# untitled'
});
