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


exports.addComment = (id, data) => {
    const username = data.username;
    const body = data.body;
  
    return db
      .query(
        "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;",
        [body, username, id]
      )
      .then(({rows}) => {
        return rows[0];
      });
  };


