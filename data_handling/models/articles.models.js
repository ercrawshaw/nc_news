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

exports.fetchArticles = (countData, sort_by = 'created_at DESC', order) => {

    if(order) {
        if (order === 'ASC' || order === 'DESC') {
            sort_by = `created_at ${order}`
        }else{
            return Promise.reject({status:400, msg:'Bad Request'})
        }
    }

    let splitSortBy = sort_by.split(" ")[0];
    
    const validSortQuery = ['title', 'topic', 'author', 'created_at', 'votes', 'article_img_url', 'article_id', 'count'];

    if (!validSortQuery.includes(splitSortBy) ) {
        return Promise.reject({status:404, msg:'Not Found'})
    }else if (!sort_by.includes('DESC') && !sort_by.includes('ASC')) {
        sort_by += " DESC"   
    };


    return db.query(`SELECT * FROM articles ORDER BY ${sort_by}`).then((result) => {
        
        result.rows.forEach((article) => {
            console.log(article);
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
            
            for (let i=0; i<countData.length; i++) {
                if (countData[i].article_id === result.rows[0].article_id) {
                    result.rows[0].comment_count = Number(countData[i].count)
                }
            }
            
          return result.rows  
          
        }
        
        
    })
};

exports.fetchArticleComments = (id) => {
    let query = "SELECT * FROM comments WHERE article_id=$1"

    return db.query(query , [id]).then((result) => {
        return result.rows
    })
};

exports.checkArticle = (id) => {
    return db
      .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
      .then(({rows}) => {
        if (rows.length === 0) {
            Promise.reject(err)
        }else{
           return rows[0]; 
        }
      });
  };

 exports.findVoteCount = (id , voteInc) => {
    
    if (typeof voteInc !== 'number') {
        return Promise.reject({status:400, msg:'Bad Request'})
    };

    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]).then(({rows}) => {
        if (rows.length ===0) {
            return Promise.reject({status:404, msg:'Not Found'})
        }else{
            let voteValue = rows[0].votes;
            voteValue += voteInc 
        
            return voteValue  
        } 
    })
 };

 exports.updateVoteCount = (id , newCount) => {
    return db.query(`UPDATE articles SET votes=${newCount} WHERE article_id=${id}`).then(({rows}) => {
        return db.query(`SELECT * FROM articles WHERE article_id=${id}`)
    })
 };

 exports.returnArticlesByTopic = (topic) => {

            return db.query('SELECT * FROM articles WHERE topic=$1', [topic]).then(({rows}) => {
            return rows
        }) 
 };

 exports.addArticleComments = (countData) => {
        return db.query(`ALTER TABLE articles
        ADD count INT;`)
        .then(() => {
            fetchArticles(countData, count)
            .then((result) => {
                console.log(result);
            })
        })
 };

 exports.fetchTopicArticles = (topic, sortBy) => {

    return db.query(`SELECT * FROM articles WHERE topic=$1 ORDER BY ${sortBy}`, [topic])
    .then(({rows}) => {
        return rows
    })
 };

 




