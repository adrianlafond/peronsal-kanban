import { toBoardData, toMarkdown, getDefaultBoard } from '../../src/services'

describe('toBoardData', () => {
  it('confirms that toBoardData is defined', () => {
    expect(toBoardData).toBeTruthy()
  })

  describe('title', () => {
    it(`returns a default title if no title is present`, () => {
      expect(toBoardData('').title).toBe(getDefaultBoard().title)
    })
    it(`returns a default title if no title exists with one "#"`, () => {
      const md = `
        ## wrong title
        ### again wrong title
      `
      expect(toBoardData(md).title).toBe(getDefaultBoard().title)
    })
    it('returns the board title', () => {
      const md = `# title 99 $%^&`
      expect(toBoardData(md).title).toEqual('title 99 $%^&')
    })
    it('ignores whitespace when returning the board title', () => {
      const md = `
         #   title 99 $%^&
      `
      expect(toBoardData(md).title).toEqual('title 99 $%^&')
    })
  })
})

describe('toMarkdown', () => {
  it('confirms that toMarkdown is defined', () => {
    expect(toMarkdown).toBeTruthy()
  })
})
