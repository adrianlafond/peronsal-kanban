import produce from 'immer'
import { board } from '../stores'

export class BoardModel {
  static updateProjectTitle(oldName: string, newName: string) {
    board.update(data => produce(data, draft => {
      const project = draft?.data?.projects.find(project => project.title === oldName)
      if (project) {
        project.title = newName
      }
    }))
  }
}
