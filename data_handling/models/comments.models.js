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
    const {username} = data;
    const {body} = data;
  
    return db
      .query(
        "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;",
        [body, username, id]
      )
      .then(({rows}) => {
        return rows[0];
      });
  };

  exports.removeCommentById = (commentId) => {
    
    const query = "DELETE FROM comments WHERE comment_id=$1;"

    return db.query(query, [commentId])
  };

  exports.fetchCommentsById = (commentId) => {
     return db.query('SELECT * FROM comments WHERE comment_id=$1', [commentId]).then(({rows}) => {
      if (rows.length === 0) {
        return Promise.reject({status:404, msg:'Not Found'})
      }
     })
  }


