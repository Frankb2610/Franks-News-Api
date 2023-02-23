const {fetchTopics, fetchArticles, fetchArticleById, fetchArticleIdComments} = require('../models/news-models')

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

exports.getArticleById = (req, res, next) => {
   const {article_id} = req.params;
    fetchArticleById(article_id).then((article)=> {
        res.status(200).send(article)
    })
    .catch((err) => {
        next(err)
    })
    
}

exports.getArticleIdComments = (req, res, next) => {
    const {article_id} = req.params;
     fetchArticleIdComments(article_id).then((comments)=> {
         res.status(200).send(comments)
     })
     .catch((err) => {
         next(err)
     })
     
 }