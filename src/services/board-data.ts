export type Status = 'backlog' | 'todo' | 'doing' | 'done' | 'archive'
export const statuses = ['backlog', 'todo', 'doing', 'done', 'archive']

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
  const lines: string[] = []
  appendHeading(lines, data.title)

  const projectTasks: { [key in Status]: string[] } = {
    backlog: [],
    todo: [],
    doing: [],
    done: [],
    archive: [],
  }

  data.tasks.forEach(task => {
    projectTasks[task.status].push(task.title)
  })

  appendHeading(lines, 'Backlog', 2)
  appendTasks(lines, projectTasks.backlog)
  appendProjects(lines, data.projects, 'backlog')
  appendHorizontalRule(lines)

  appendHeading(lines, 'To Do', 2)
  appendTasks(lines, projectTasks.todo)
  appendProjects(lines, data.projects, 'todo')
  appendHorizontalRule(lines)

  appendHeading(lines, 'Doing', 2)
  appendTasks(lines, projectTasks.doing)
  appendProjects(lines, data.projects, 'doing')
  appendHorizontalRule(lines)

  appendHeading(lines, 'Done', 2)
  appendTasks(lines, projectTasks.done)
  appendProjects(lines, data.projects, 'done')
  appendHorizontalRule(lines)

  appendHeading(lines, 'Archive', 2)
  appendTasks(lines, projectTasks.archive)
  appendProjects(lines, data.projects, 'archive')
  appendHorizontalRule(lines)

  return lines.join('\n')
}

function appendTasks(lines: string[], tasks: string[]) {
  if (tasks.length) {
    tasks.forEach(task => {
      lines.push(`- ${task}`)
    })
    lines.push('')
  }
}

function appendProjects(lines: string[], projects: Project[], status: Status) {
  projects.forEach(project => {
    appendHeading(lines, project.title, 3)
    appendTasks(lines, project.tasks
      .filter(task => task.status === status)
      .map(task => task.title))
  })
}

function appendHeading(lines: string[], status: string, level = 1) {
  let h = ''
  while (level > 0) {
    h += '#'
    level -= 1
  }
  lines.push(`${h} ${status}`)
  lines.push('')
}

function appendHorizontalRule(lines: string[]) {
  lines.push('----------')
  lines.push('')
}
