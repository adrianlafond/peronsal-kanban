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

export function getDefaultBoard(): BoardData {
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
  return `# ${data.title}`
}

// Non-exported utils to help convert markdown to BoardData.
function getTitle(markdown: string) {
  const titleMatch = markdown.match(/^[ ]*#[ ]+([\S ]+)/m)
  return titleMatch && titleMatch[1].trim();
}
