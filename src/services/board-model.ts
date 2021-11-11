import produce from 'immer'
import { get } from 'svelte/store'
import { board } from '../stores'
import type { Status, Project, TaskData, Task, BoardData } from './board-types'
import { BoardFile } from './board-file'
import { getProjectColor } from './color'
import { Uid } from './uid'
import type Project__SvelteComponent_ from '../components/Project.svelte'

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

  static moveProject(project: Project, target: TaskData, fromStatus: Status) {
    // Create a new project with relevant tasks' status updated.
    const newProject = {
      title: project.title,
      id: project.id,
      color: project.color,
      tasks: project.tasks.map(task => ({
        id: task.id,
        title: task.title,
        status: target.status && task.status === fromStatus ? target.status : task.status,
      })),
    }

    board.update(data => produce(data, draft => {
      // Change the order of the project amongst other projects.
      BoardModel.deleteProject(draft.data, project)
      if (target.project) {
        draft.data.projects.some((boardProject, index, array) => {
          if (boardProject.id === target.project) {
            array.splice(index + 1, 0, newProject)
            return true
          }
        })
      } else {
        draft.data.projects.unshift(newProject)
      }
    }))
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

  private static deleteProject(board: BoardData, project: Project) {
    board.projects.find((boardProject, index, array) => {
      if (boardProject.id === project.id) {
        array.splice(index, 1);
        return true;
      }
    })
  }

  private static getProjectById(board: BoardData, id: string) {
    return board.projects.find(project => project.id === id)
  }
}
