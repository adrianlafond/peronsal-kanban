export class Uid {
  private static projectIndex = 0
  private static taskIndex = 0

  static get project() {
    return `project-${Uid.projectIndex++}`
  }

  static get task() {
    return `task-${Uid.taskIndex++}`
  }
}
