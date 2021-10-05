const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()
app.use(bodyParser.json())
const port = 3000

app.get('/', (_req, res) => {
  res.send('Personal Kanban')
})

function sendBoard (file, res) {
  res.sendFile(file, (err) => {
    if (err) {
      res.send(err)
    }
  })
}

// Fetches a board file.
app.post('/board', (req, res) => {
  sendBoard(req.body.file, res)
})

// Updates a board file.
app.put('/board', (req, res) => {
  const { file, data } = req.body
  fs.stat(file, (err) => {
    if (err) {
      res.send(err)
    } else {
      fs.writeFile(file, data, (err) => {
        if (err) {
          res.send(err)
        } else {
          sendBoard(file, res)
        }
      })
    }
  })
})

app.listen(port, () => {
  console.log(`Server is live at http://localhost:${port}`)
})
