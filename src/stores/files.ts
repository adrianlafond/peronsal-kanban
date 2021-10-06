import { writable } from 'svelte/store';

export interface Files {
  active: number;
  files: string[];
  activeFile: string | null;
  loading: boolean;
  error: string | null;
}

export const files = writable<Files>({
  active: 0,
  files: [],
  activeFile: null,
  loading: false,
  error: null,
});
