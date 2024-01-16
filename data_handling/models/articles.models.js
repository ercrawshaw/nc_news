const db = require('../../db/connection');



exports.returnCommentCount = ()  => {
    let query = `SELECT COUNT(comment_id), article_id
    FROM comments
    GROUP BY article_id
    HAVING COUNT(comment_id)>0`;

    return db.query(query).then((result) => {
        const array = [];
        result.rows.forEach((item) => {
            array.push(item)
        })
        return array
    })
};




exports.fetchArticles = (countData) => {

    let query = `SELECT * FROM articles ORDER BY created_at DESC`;

    return db.query(query).then((result) => {
       
        
        result.rows.forEach((article) => {
            delete article.body
            article.comment_count = 0;
            for (let i=0; i<countData.length; i++) {
                if (countData[i].article_id === article.article_id) {

                    article.comment_count = Number(countData[i].count)
                }
            }
        })
        return result.rows 
    
})
};

exports.fetchArticlesById = (id, countData) => {

    let query = "SELECT * FROM articles WHERE article_id = $1"

    return db.query(query,[id]).then((result) => {
        
        if (result.rows.length === 0) {
            return Promise.reject({status:404, msg:'Not Found'})
        }else{
            delete result.rows[0].body
            for (let i=0; i<countData.length; i++) {
                if (countData[i].article_id === result.rows[0].article_id) {
                    result.rows[0].comment_count = Number(countData[i].count)
                }
            }
          return result.rows  
        }
        
        
    })
}