const express = require('express')

const app = express()
const port = 3000

app.get('/', (_req, res) => {
  res.send('Personal Kanban')
})

// Fetches a board file. If file does not exist, creates it.
app.post('/board', (req, res) => {
  //
})

// Updates a board file.
app.put('/board', (req, res) => {
  //
})

app.delete('/board', (req, res) => {
  //
})

app.listen(port, () => {
  console.log(`Server is live at http://localhost:${port}`)
})
