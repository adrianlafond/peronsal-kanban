export type Status = 'todo' | 'doing' | 'done' | 'archive'

export interface Task {
  title: string
  status: Status
  id?: string
}

export interface Project {
  title: string
  tasks: Task[]
  id?: string
  color?: string
}

export interface BoardData {
  title: string
  projects: Project[]
  tasks: Task[]
}
