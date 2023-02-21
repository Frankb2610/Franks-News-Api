const {fetchTopics} = require('../models/news-models')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topicsArray) =>{
        res.status(200).send({topics: topicsArray})
    })
    .catch(next)
}