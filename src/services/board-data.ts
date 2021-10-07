export interface BoardData {
  title: string;
  projects: Project[];
}

export interface Project {
  title: string;
  tasks: Task[];
}

export interface Task {
  title: string;
  status: 'backlog' | 'todo' | 'doing' | 'done' | 'archive';
}

export function getDefaultBoard() {
  return { title: 'Personal Kanban', projects: [] };
}

/**
 * Converts custom kanban markdown into a BoardData object.
 */
export function toBoardData(markdown: string): BoardData {
  const data = getDefaultBoard();
  data.title = getTitle(markdown) || data.title

  return data
}

/**
 * Converts a BoardData object into a markdown string.
 */
export function toMarkdown(data: BoardData): string {
  return ''
}

function getTitle(markdown: string) {
  const titleMatch = markdown.match(/^\s*#\s+([\S\s]+)/)
  return titleMatch && titleMatch[1].trim();
}
