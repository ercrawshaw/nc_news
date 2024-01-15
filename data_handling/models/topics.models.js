const db = require('../../db/connection');

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`).then((result) => {
        return result.rows;
    })
};

exports.fetchArticles = (id) => {
    let query = `SELECT * FROM articles`;

    if (id) {
        query += ` WHERE article_id = ${id};`;
    }

    return db.query(query).then((result) => {
        
        if (result.rows.length === 0) {
            return Promise.reject({status:404, msg:'Not Found'})
        }else{
          return result.rows;  
        }
        
    })
}

