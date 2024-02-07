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
  };


  exports.findCommentVoteCount = (id , voteInc) => {
    
    if (typeof voteInc !== 'number') {
        return Promise.reject({status:400, msg:'Bad Request'})
    };

    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [id]).then(({rows}) => {
        if (rows.length ===0) {
            return Promise.reject({status:404, msg:'Not Found'})
        }else{
            let voteValue = rows[0].votes;
            voteValue += voteInc 
        
            return voteValue  
        } 
    })
 };

 exports.updateCommentVoteCount = (id , newCount) => {
  return db.query(`UPDATE comments SET votes=${newCount} WHERE comment_id=${id}`).then(({rows}) => {
      return db.query(`SELECT * FROM comments WHERE comment_id=${id}`)
  })
};

