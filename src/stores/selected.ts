import { writable } from 'svelte/store'
import type { Project, Status, Task } from '../services/board-types'

export interface Selected {
  projects: string[]
  tasks: string[]
  status: Status
}

export function getSelectedReset(): Selected {
  return {
    projects: [],
    tasks: [],
    status: 'todo'
  }
}

export const selected = writable<Selected>(getSelectedReset())
