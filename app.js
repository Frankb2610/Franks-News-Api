const express = require('express')
const app = express()
const { getTopics, getArticles, getArticleById, getArticleIdComments } = require('./controllers/news-controller')
const { errorHandlingCustom, errorHandling500, errorHandlingPSQL400 } = require('./error-handling')

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getArticleIdComments)

app.use(errorHandlingCustom);
app.use(errorHandlingPSQL400);
app.use(errorHandling500);

module.exports = app