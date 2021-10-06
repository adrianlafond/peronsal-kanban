import { writable } from 'svelte/store';

// TODO: add files [] and activeFileIndex
export interface BoardFiles {
  activeFile: string | null;
  loading: boolean;
  error: string | null;
}

export const boardFiles = writable<BoardFiles>({
  activeFile: null,
  loading: false,
  error: null,
});
