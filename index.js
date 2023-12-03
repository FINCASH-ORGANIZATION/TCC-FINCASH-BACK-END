const express = require('express')
const app = express()
const port = 3000

app.get('/Usuario', (req, res) => {
  res.send('oi!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})