import { writable } from 'svelte/store';

export interface Board {
  markdown: string;
}

export const board = writable<Board>({
  markdown: '# untitled'
});
