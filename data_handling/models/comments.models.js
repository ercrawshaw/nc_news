const db = require('../../db/connection');



exports.fetchCommentsByArticleId = (id) => {
    
    let query = "SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC"

    return db.query(query,[id]).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status:404, msg:'Not Found'})
        }else{
            return result.rows  
        }
        
    })
};


