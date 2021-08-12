import express from 'express'

const app = express()
const port = 3030

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
