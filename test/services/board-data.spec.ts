import {
  toBoardData,
  toMarkdown,
  getDefaultBoard,
  statuses,
  Status,
} from '../../src/services'

describe('toBoardData', () => {
  it('confirms that toBoardData is defined', () => {
    expect(toBoardData).toBeTruthy()
  })

  describe('title', () => {
    it('returns a default title if no title is present', () => {
      expect(toBoardData('').title).toBe(getDefaultBoard().title)
    })
    it('returns a default title if no title exists with one "#"', () => {
      const md = `
        ## wrong title
        ### again wrong title
      `
      expect(toBoardData(md).title).toBe(getDefaultBoard().title)
    })
    it('returns the board title', () => {
      const md = '# #title 99 $%^&'
      expect(toBoardData(md).title).toBe('#title 99 $%^&')
    })
    it('ignores whitespace when returning the board title', () => {
      const md = `
        unrelated

        #   #title 99 $%^&

        unrelated
      `
      expect(toBoardData(md).title).toBe('#title 99 $%^&')
    })
  })

  describe('projects and tasks', () => {
    it('assigns board-level tasks to the backlog', () => {
      const md = `
        - board-level task
      `
      const boardData = toBoardData(md)
      expect(boardData.tasks[0].title).toEqual('board-level task')
      expect(boardData.tasks[0].status).toEqual('backlog')
    })
    describe('projects', () => {
      it('finds board-level projects', () => {
        const md = `
        ### abcdefg
      `
        expect(toBoardData(md).projects[0].title).toBe('abcdefg')
      })
    })
    it('assigns tasks in board-level projects to the backlog', () => {
      const md = `
        ### project-title
        - task A
        - task B
      `
      const boardData = toBoardData(md)
      expect(boardData.tasks.length).toBe(0)
      expect(boardData.projects.length).toBe(1)
      expect(boardData.projects[0].title).toBe('project-title')
      expect(boardData.projects[0].tasks.length).toBe(2)
      expect(boardData.projects[0].tasks[0].title).toBe('task A')
      expect(boardData.projects[0].tasks[0].status).toBe('backlog')
      expect(boardData.projects[0].tasks[1].title).toBe('task B')
      expect(boardData.projects[0].tasks[1].status).toBe('backlog')
    })
    statuses.forEach(status => {
      it(`assigns tasks in ${status} to ${status}`, () => {
        const md = `
          ## ${status}
          - task A
          - task B
        `
        const boardData = toBoardData(md)
        expect(boardData.projects.length).toBe(0)
        expect(boardData.tasks.length).toBe(2)
        expect(boardData.tasks[0].title).toBe('task A')
        expect(boardData.tasks[0].status).toBe(status)
        expect(boardData.tasks[1].title).toBe('task B')
        expect(boardData.tasks[1].status).toBe(status)
      })
      it(`assigns tasks in projects in ${status} to ${status}`, () => {
        const md = `
          ## ${status}
          ### project-title
          - task A
          - task B
        `
        const boardData = toBoardData(md)
        expect(boardData.tasks.length).toBe(0)
        expect(boardData.projects.length).toBe(1)
        expect(boardData.projects[0].title).toBe('project-title')
        expect(boardData.projects[0].tasks.length).toBe(2)
        expect(boardData.projects[0].tasks[0].title).toBe('task A')
        expect(boardData.projects[0].tasks[0].status).toBe(status)
        expect(boardData.projects[0].tasks[1].title).toBe('task B')
        expect(boardData.projects[0].tasks[1].status).toBe(status)
      })
    })
    it('captures all projects and tasks when status is duplicated', () => {
      const md = `
        ## To do
        ### project-title
        - task A

        ## TODO
        ### project-title
        - task B
      `
      const boardData = toBoardData(md)
      expect(boardData.tasks.length).toBe(0)
      expect(boardData.projects.length).toBe(1)
      expect(boardData.projects[0].title).toBe('project-title')
      expect(boardData.projects[0].tasks.length).toBe(2)
      expect(boardData.projects[0].tasks[0].title).toBe('task A')
      expect(boardData.projects[0].tasks[0].status).toBe('todo')
      expect(boardData.projects[0].tasks[1].title).toBe('task B')
      expect(boardData.projects[0].tasks[1].status).toBe('todo')
    })
    it('captures all projects and tasks when project is duplicated', () => {
      const md = `
        ## todo
        ### project-title
        - task A
        ### project-title
        - task B
      `
      const boardData = toBoardData(md)
      expect(boardData.tasks.length).toBe(0)
      expect(boardData.projects.length).toBe(1)
      expect(boardData.projects[0].title).toBe('project-title')
      expect(boardData.projects[0].tasks.length).toBe(2)
      expect(boardData.projects[0].tasks[0].title).toBe('task A')
      expect(boardData.projects[0].tasks[0].status).toBe('todo')
      expect(boardData.projects[0].tasks[1].title).toBe('task B')
      expect(boardData.projects[0].tasks[1].status).toBe('todo')
    })
    it('allows duplicate tasks (because user wishes to rename a task later)', () => {
      const md = `
        ## todo
        ### project-title
        - task A
        - task A
      `
      const boardData = toBoardData(md)
      expect(boardData.tasks.length).toBe(0)
      expect(boardData.projects.length).toBe(1)
      expect(boardData.projects[0].title).toBe('project-title')
      expect(boardData.projects[0].tasks.length).toBe(2)
      expect(boardData.projects[0].tasks[0].title).toBe('task A')
      expect(boardData.projects[0].tasks[0].status).toBe('todo')
      expect(boardData.projects[0].tasks[1].title).toBe('task A')
      expect(boardData.projects[0].tasks[1].status).toBe('todo')
    })
    it('captures tasks mixed between projects, status, and board levels', () => {
      const md = `
        - task D
        ### project A
        - task A
        ## todo
        - task B
        ### project A
        - task C
        - task E
        # my board
        - task E
      `
      const boardData = toBoardData(md)
      expect(boardData.title).toBe('my board')
      expect(boardData.tasks.length).toBe(3)
      expect(boardData.tasks[0].title).toBe('task D')
      expect(boardData.tasks[0].status).toBe('backlog')
      expect(boardData.tasks[1].title).toBe('task B')
      expect(boardData.tasks[1].status).toBe('todo')
      expect(boardData.tasks[2].title).toBe('task E')
      expect(boardData.tasks[2].status).toBe('backlog')
      expect(boardData.projects.length).toBe(1)
      expect(boardData.projects[0].title).toBe('project A')
      expect(boardData.projects[0].tasks.length).toBe(3)
      expect(boardData.projects[0].tasks[0].title).toBe('task A')
      expect(boardData.projects[0].tasks[0].status).toBe('backlog')
      expect(boardData.projects[0].tasks[1].title).toBe('task C')
      expect(boardData.projects[0].tasks[1].status).toBe('todo')
      expect(boardData.projects[0].tasks[2].title).toBe('task E')
      expect(boardData.projects[0].tasks[2].status).toBe('todo')
    })
  })
})

describe('toMarkdown', () => {
  it('confirms that toMarkdown is defined', () => {
    expect(toMarkdown).toBeTruthy()
  })
  it('writes the title', () => {
    const data = { title: '#title 99 $%^&', projects: [], tasks: [] }
    expect(toBoardData(toMarkdown(data)).title).toBe('#title 99 $%^&')
  })
  statuses.forEach(status => {
    it(`writes project-level tasks to status ${status}`, () => {
      const input = {
        title: 'A',
        projects: [],
        tasks: [{ title: 'B', status: status as Status }],
      }
      const output = toBoardData(toMarkdown(input))
      expect(output.tasks.length).toBe(1)
      expect(output.tasks[0].title).toBe('B')
      expect(output.tasks[0].status).toBe(status)
    })
    it(`writes projects and project tasks to status ${status}`, () => {
      const input = {
        title: 'A',
        projects: [{ title: 'B', tasks: [{ title: 'C', status: status as Status }]}],
        tasks: [],
      }
      const output = toBoardData(toMarkdown(input))
      expect(output.tasks.length).toBe(0)
      expect(output.projects.length).toBe(1)
      expect(output.projects[0].title).toBe('B')
      expect(output.projects[0].tasks.length).toBe(1)
      expect(output.projects[0].tasks[0].title).toBe('C')
      expect(output.projects[0].tasks[0].status).toBe(status)
    })
  })
})
