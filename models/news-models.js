const db = require('../db/connection.js')

const fetchTopics = () => {
    return db
    .query(`SELECT * FROM topics;`)
    .then((result) => {
        return result.rows
    })
}


const fetchArticles = () => {

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



const fetchArticleById = (inputId) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [inputId])
    .then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject('invalid id entered')
        }
        return result.rows[0]
    })
}

const fetchArticleIdComments = (inputId) => {

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

const insertComment = (article_id, username, body) => {
        if (!username) {
            return Promise.reject('username required')
        }
    
        if (!body) {
            return Promise.reject('body required')
        } 
        
        return db.query(`
        SELECT * FROM users
        WHERE username = $1;`, [username])
        .then((result)=> {
            if (!result.rows[0]){
                return Promise.reject('invalid username entered')
            } else {
                return fetchArticleById(article_id).then((article)=> {
         
                    return db.query(`
                    INSERT INTO comments
                    (article_id, author, body)
                    VALUES
                    ($1, $2, $3)
                    RETURNING *;
                    `, [article_id, username, body]
                ).then((result) => {
            
                    return result.rows[0];
                });
                })
            }
           
        })
      }
      const alterVotes = (article_id, inc_votes) => {
    
        if (!inc_votes) {
            return Promise.reject('Invalid input');
        }
    
        if(isNaN(inc_votes)){
            return Promise.reject("number required")
        }
    
        return db.query(`UPDATE articles
        SET votes=votes + $1 
        WHERE article_id=$2 
        RETURNING *;`,
            [inc_votes, article_id]
        ).then((result) => {
            const data = result.rows
            if (data && data.length === 0) {
                return Promise.reject("invalid id entered")
            } else {
                return data[0];
            }
        })
    };


    module.exports = {fetchTopics, fetchArticles, fetchArticleById, fetchArticleIdComments, insertComment, alterVotes}