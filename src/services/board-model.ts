import produce from 'immer'
import { board } from '../stores'

export class BoardModel {
  static updateBoardTitle(newName: string) {
    board.update(data => produce(data, draft => {
      draft.data.title = newName;
    }))
  }

  static updateBoardTaskTitle(oldName: string, newName: string) {
    board.update(data => produce(data, draft => {
      const task = draft.data.tasks.find(task => task.title === oldName)
      if (task) {
        task.title = newName
      }
    }))
  }

  static updateProjectTitle(oldName: string, newName: string) {
    board.update(data => produce(data, draft => {
      const project = draft.data.projects.find(project => project.title === oldName)
      if (project) {
        project.title = newName
      }
    }))
  }

  static updateProjectTaskTitle(projectName: string, oldName: string, newName: string) {
    board.update(data => produce(data, draft => {
      const project = draft.data.projects.find(project => project.title === projectName)
      if (project) {
        const task = project.tasks.find(task => task.title === oldName)
        console.log('updateProjectTaskTitle()', !!task, oldName, oldName.length, '|', project.tasks[0]?.title, project.tasks[0]?.title.length, '|', newName);
        if (task) {
          task.title = newName
        }
      }
    }))
  }
}
