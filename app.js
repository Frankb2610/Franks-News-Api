const express = require('express')
const app = express()
const { getTopics } = require('./controllers/news-controller')


app.get('/api/topics', getTopics)

app.all('/*', (req, res, next) => {
    next({status: 404});
  })


app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({msg : "404 not found!!!"})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Server Error!');
  });


module.exports = app