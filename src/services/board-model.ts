import produce from 'immer'
import { board } from '../stores'
import type { Status, Project } from './board-types'
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
}
