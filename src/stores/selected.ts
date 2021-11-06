import { writable } from 'svelte/store'
import type { Project, Task } from '../services/board-types'

export interface Selected {
  projects: Project[]
  tasks: Task[]
}

export const board = writable<Selected>({
  projects: [],
  tasks: [],
})
