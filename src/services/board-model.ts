import produce from 'immer'
import { board } from '../stores'

export class BoardModel {
  static updateBoardTitle(newName: string) {
    board.update(data => produce(data, draft => {
      draft.data.title = newName;
    }))
  }

  static updateBoardTaskTitle(newName: string, id?: string) {
    board.update(data => produce(data, draft => {
      const task = draft.data.tasks.find(task => task.id === id)
      if (task) {
        task.title = newName
      }
    }))
  }

  static updateProjectTitle(newName: string, id?: string) {
    board.update(data => produce(data, draft => {
      const project = draft.data.projects.find(project => project.id === id)
      if (project) {
        project.title = newName
      }
    }))
  }

  static updateProjectTaskTitle(newName: string, projectId?: string, taskId?: string) {
    board.update(data => produce(data, draft => {
      const project = draft.data.projects.find(project => project.id === projectId)
      if (project) {
        const task = project.tasks.find(task => task.id === taskId)
        if (task) {
          task.title = newName
        }
      }
    }))
  }
}
