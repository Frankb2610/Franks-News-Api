const {fetchTopics, fetchArticles} = require('../models/news-models')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topicsArray) =>{
        res.status(200).send({topics: topicsArray})
    })
    .catch( (err) => {
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    fetchArticles().then((articlesArray) =>{
        res.status(200).send({articles: articlesArray})
    })
    .catch((err) => {
        next(err)
    })
}