const express = require('express')
const app = express()
const { getTopics, getArticles, getArticleById, getArticleIdComments, postComment } = require('./controllers/news-controller')
const { errorHandlingCustom, errorHandling500, errorHandlingPSQL400 } = require('./error-handling')

app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getArticleIdComments)
app.post('/api/articles/:article_id/comments', postComment)

app.use(errorHandlingCustom);
app.use(errorHandlingPSQL400);
app.use(errorHandling500);

module.exports = app