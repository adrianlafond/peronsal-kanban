export const statuses = ['backlog', 'todo', 'doing', 'done', 'archive']
export type Status = 'backlog' | 'todo' | 'doing' | 'done' | 'archive'

export interface Task {
  title: string;
  status: Status;
}

export interface Project {
  title: string;
  tasks: Task[];
  color?: string;
}

export interface BoardData {
  title: string;
  projects: Project[];
  tasks: Task[];
}

export const colors = [
  '#6929c4',
  '#1192e8',
  '#005d5d',
  '#9f1853',
  '#fa4d56',
  '#570408',
  '#198038',
  '#002d9c',
  '#ee538b',
  '#b28600',
  '#009d9a',
  '#012749',
  '#8a3800',
  '#a56eff',
]

export function getDefaultBoard(): BoardData {
  return { title: 'Personal Kanban', projects: [], tasks: [] }
}

/**
 * Converts custom kanban markdown into a BoardData object.
 */
export function toBoardData(markdown: string): BoardData {
  const data = getDefaultBoard()
  const lines = markdown.replace('\r', '\n').split('\n')

  let titleFound = false
  let project: BoardData | Project = data
  let status: Status = 'backlog'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (!titleFound) {
      const titleMatch = line.match(/^[ ]*#[ ]+([\S ]+)/)
      if (titleMatch) {
        data.title = titleMatch[1].trim()
        titleFound = true
        project = data
        status = 'backlog'
        continue
      }
    }

    const taskMatch = line.match(/^[ ]*-[ ]+([\S ]+)/)
    if (taskMatch) {
      project.tasks.push({
        title: taskMatch[1].trim(),
        status,
      })
    }

    const statusMatch = line.match(/^[ ]*##[ ]+([\S ]+)/)
    if (statusMatch) {
      const statusTitle = statusMatch[1].trim().replace(/\s/g, '').toLowerCase()
      if (statuses.indexOf(statusTitle) !== -1) {
        status = statusTitle as Status
        project = data
      }
    }

    const projectMatch = line.match(/^[ ]*###[ ]+([\S ]+)/)
    if (projectMatch) {
      const projectTitle = projectMatch[1].trim()
      const foundProject = data.projects.find(project => project.title === projectTitle)
      if (foundProject) {
        project = foundProject
      } else {
        project = { title: projectTitle, tasks: [] }
        data.projects.push(project)
      }
    }
  }

  data.projects.forEach((project, index) => {
    project.color = colors[index % data.projects.length]
  })

  return data
}

/**
 * Converts a BoardData object into a markdown string.
 */
export function toMarkdown(data: BoardData): string {
  return `# ${data.title}`
}
