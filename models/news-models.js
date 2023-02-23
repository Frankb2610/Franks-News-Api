const db = require('../db/connection.js')

exports.fetchTopics = () => {
    return db
    .query(`SELECT * FROM topics;`)
    .then((result) => {
        return result.rows
    })
}

exports.fetchArticles = () => {

    return db.query(`
    SELECT title, topic, author, article_id, created_at, votes, article_img_url, COUNT(article_id) AS comment_count
FROM articles
GROUP BY article_id
ORDER BY created_at DESC;
    `).then((result) => {
        const data = result.rows
        return data;
    });
}

exports.fetchArticleById = (inputId) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [inputId])
    .then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject('invalid id entered')
        }
        return result.rows[0]
    })
}

exports.fetchArticleIdComments = (inputId) => {

    return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [inputId])
    .then((result) => {
        if (result.rowCount=== 0) {
            return db
            .query(`SELECT article_id FROM articles
            ORDER BY created_at DESC`)
            .then((result2) => {
               
                array = result2.rows
               filteredArray = array.filter(id  => id.article_id === parseInt(inputId)) 
                if(filteredArray.length === 0) {
                    return Promise.reject('invalid id entered')
                } else {
                    return result.rows
                    
                }
            })
        } else {
            return result.rows
        }
        
    })

}
  