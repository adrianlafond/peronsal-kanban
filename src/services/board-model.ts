import produce from 'immer'
import { get } from 'svelte/store'
import { board } from '../stores'
import type { Status, Project, TaskData, Task, BoardData } from './board-types'
import { BoardFile } from './board-file'
import { getProjectColor } from './color'
import { Uid } from './uid'

export class BoardModel {
  static updateBoardTitle(newTitle: string) {
    board.update(data => produce(data, draft => {
      draft.data.title = newTitle;
    }))
  }

  static updateBoardTaskTitle(newTitle: string, id?: string) {
    board.update(data => produce(data, draft => {
      const task = draft.data.tasks.find(task => task.id === id)
      if (task) {
        task.title = newTitle
      }
    }))
  }

  static updateProjectTitle(newTitle: string, id?: string) {
    board.update(data => produce(data, draft => {
      const project = draft.data.projects.find(project => project.id === id)
      if (project) {
        project.title = newTitle
      }
    }))
  }

  static updateProjectTaskTitle(newTitle: string, projectId?: string, taskId?: string) {
    board.update(data => produce(data, draft => {
      const project = draft.data.projects.find(project => project.id === projectId)
      if (project) {
        const task = project.tasks.find(task => task.id === taskId)
        if (task) {
          task.title = newTitle
        }
      }
    }))
  }

  static addProject(title: string, status: Status = 'todo') {
    board.update(data => produce(data, draft => {
      const project: Project = {
        title,
        id: Uid.project,
        color: getProjectColor(),
        tasks: [{
          id: Uid.task,
          title: 'new task',
          status,
        }],
      }
      draft.data.projects.unshift(project)
    }))
    BoardFile.write()
  }

  static addTask(title: string, status: Status = 'todo', projectId?: string) {
    board.update(data => produce(data, draft => {
      const task = {
        id: Uid.task,
        title,
        status
      }
      if (projectId) {
        const project = draft.data.projects.find(p => p.id === projectId)
        if (project) {
          project.tasks.unshift(task)
        }
      } else {
        draft.data.tasks.unshift(task)
      }
    }))
    BoardFile.write()
  }

  static moveTask(task: Task, target: TaskData) {
    if (target.status) {
      board.update(data => produce(data, draft => {
        BoardModel.deleteTask(draft.data, task)
        const newTask = Object.assign({}, task)
        if (target.status) {
          newTask.status = target.status
        }
        if (target.task) {
          if (target.project) {
            // Task should be added to a project.
            const project = BoardModel.getProjectById(draft.data, target.project)
            if (project) {
              BoardModel.addTaskToTasksArray(project.tasks, target.task, newTask)
            }
          } else {
            // Moved task is not in a project.
            BoardModel.addTaskToTasksArray(draft.data.tasks, target.task, newTask)
          }

        } else {
          // The moved task is not below any target task, so it can be dropped
          // at the top of board's tasks.
          draft.data.tasks.unshift(newTask)
        }
      }))
    }
  }

  private static addTaskToTasksArray(tasks: Task[], targetTask: string, task: Task) {
    const added = tasks.some((testTask, index, array) => {
      if (testTask.id === targetTask) {
        array.splice(index + 1, 0, task)
        return true
      }
      return false
    })
    if (!added) {
      tasks.unshift(task)
    }
  }

  private static deleteTask(board: BoardData, task: Task) {
    const deletedFromBoardTasks = BoardModel.deleteTaskFromTasksArray(board.tasks, task)
    if (!deletedFromBoardTasks) {
      board.projects.some(project => BoardModel.deleteTaskFromTasksArray(project.tasks, task))
    }
  }

  private static deleteTaskFromTasksArray(tasks: Task[], task: Task) {
    return !!tasks.find((boardTask: Task, index: number, array: Task[]) => {
      if (boardTask.id === task.id) {
        array.splice(index, 1)
        return true
      }
    })
  }

  private static getProjectById(board: BoardData, id: string) {
    return board.projects.find(project => project.id === id)
  }
}
