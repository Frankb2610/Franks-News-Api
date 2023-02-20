const { fetchTopics }= require('../models/news-models')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topicsArray)=>{
        if (err) next(err);
        else res.status(200).send({topics: topicsArray})
    })

}