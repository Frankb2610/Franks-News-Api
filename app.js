const express = require('express')
const app = express()
const { getTopics, getArticles, getArticleById } = require('./controllers/news-controller')
const { errorHandlingCustom, errorHandling500, errorHandlingPSQL400 } = require('./error-handling')

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)


app.use(errorHandlingCustom);
app.use(errorHandlingPSQL400);
app.use(errorHandling500);

module.exports = app