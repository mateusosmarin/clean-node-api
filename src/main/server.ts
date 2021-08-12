import app from './config/app'

const port = 3030

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
