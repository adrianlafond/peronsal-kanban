import { get } from 'svelte/store'
import { selected, getSelectedReset } from '../stores/selected'
import type { Task } from './board-types';

export type SelectionMode = 'sequential' | 'nonsequential' | 'single'

export class Selection {
  private static _instance = new Selection()

  private _mode: SelectionMode = 'single'

  constructor() {
    if (Selection._instance) {
      throw new Error('Selection must not be instantiated directly. Call Selection.instance instead.')
    } else {
      this.initialize()
    }
  }

  static get instance() {
    if (!Selection._instance) {
      Selection._instance = new Selection()
    }
    return Selection._instance
  }

  destroy() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  }

  selectTask(task: Task) {
    if (task.status !== get(selected).status) {
      // If status is different from previously selected items, reset the selection.
      selected.update(() => ({
        ...getSelectedReset(),
        status: task.status,
        tasks: [task.id],
      }))
    } else if (this.mode === 'single') {
      selected.update(data => ({
        ...data,
        status: task.status,
        tasks: [task.id],
      }))
    } else if (this.mode === 'nonsequential') {
      selected.update(data => ({
        ...data,
        status: task.status,
        tasks: data.tasks.indexOf(task.id) === -1 ? [...data.tasks, task.id] : data.tasks,
      }))
    } else if (this.mode === 'sequential') {
      selected.update(data => {
        const taskEl = document.querySelector(`[data-kanban-task="${task.id}"]`)
        const indexEl = data.tasks.length
          ? document.querySelector(`[data-kanban-task="${data.tasks[0]}"]`)
          : taskEl

        let tasks = [task.id]
        if (taskEl !== indexEl) {
          tasks = []
          const statusEl = document.querySelector(`[data-kanban-type="status"][data-kanban-status="${task.status}"]`)
          if (statusEl) {
            const taskEls = statusEl.querySelectorAll('[data-kanban-type="task"]')
            let taskIndex = -1
            let indexIndex = -1
            for (let i = 0; i < taskEls.length; i++) {
              if (taskEls[i] === taskEl) {
                taskIndex = i
              } else if (taskEls[i] === indexEl) {
                indexIndex = i
              }
              if (taskIndex !== -1 && indexIndex !== -1) {
                break
              }
            }

            if (indexIndex < taskIndex) {
              for (let i = indexIndex; i <= taskIndex; i++) {
                tasks.push(taskEls[i].getAttribute('data-kanban-task')!)
              }
            } else {
              for (let i = indexIndex; i >= taskIndex; i--) {
                tasks.push(taskEls[i].getAttribute('data-kanban-task')!)
              }
            }
          }
        }

        return {
          ...data,
          status: task.status,
          tasks,
        }
      })
    }
  }

  private initialize() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Meta' || event.key === 'Shift') {
      // Cmd/Meta key (nonsequential) takes precedence over Shift (sequential)
      this.mode = event.metaKey ? 'nonsequential' : 'sequential'
    } else {
      this.mode = 'single';
    }
  }

  private onKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Meta' || event.key === 'Shift') {
      // If Meta or Shift is now *up*, pay attention to whether Meta or Shift
      // is still *down*; otherwise cancel Selection.mode.
      if (event.metaKey) {
        this.mode = 'nonsequential'
      } else if (event.shiftKey) {
        this.mode = 'sequential'
      } else {
        this.mode = 'single'
      }
    }
  }

  private get mode(): SelectionMode {
    return this._mode
  }

  private set mode(value: SelectionMode) {
    this._mode = value
  }
}
