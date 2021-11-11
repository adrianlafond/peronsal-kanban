import { writable } from 'svelte/store'
import type { Project, Status, Task } from '../services/board-types'

export interface Selected {
  projects: string[]
  tasks: string[]
  status: Status
  dragging: {
    clientX: number
    clientY: number
  } | null
}

export function getSelectedReset(): Selected {
  return {
    projects: [],
    tasks: [],
    status: 'todo',
    dragging: null,
  }
}

export const selected = writable<Selected>(getSelectedReset())
