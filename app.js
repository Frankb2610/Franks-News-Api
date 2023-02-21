const express = require('express')
const app = express()
const { getTopics } = require('./controllers/news-controller')
const { customErrorHandling, errorHandling500 } = require('./error-handling')


app.get('/api/topics', getTopics)


app.all('/*', (req, res, next) => {
    next({status: 404});
  })


app.use(customErrorHandling)

app.use(errorHandling500)


module.exports = app