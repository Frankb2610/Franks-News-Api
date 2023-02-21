const express = require('express')
const app = express()
const { getTopics, getArticles } = require('./controllers/news-controller')
const { errorHandling400, errorHandling500, nonExistentPaths } = require('./error-handling')

app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Path not found' })
})

app.use(nonExistentPaths);
app.use(errorHandling400);
app.use(errorHandling500);


module.exports = app