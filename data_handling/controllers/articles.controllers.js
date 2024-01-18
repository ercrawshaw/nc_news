const {fetchArticles , returnCommentCount , fetchArticlesById , checkArticle , findVoteCount , updateVoteCount , returnArticlesByTopic, fetchArticleComments } = require('../models/articles.models');
const {fetchCommentsByArticleId , addComment} = require('../models/comments.models');

const { checkTopicExists } = require('../models/topics.models')


exports.getArticles = (req, res, next) => {
    const {topic} = req.query;
    
    if(topic) {
        const promises = [checkTopicExists(topic), returnArticlesByTopic(topic)];
        Promise.all(promises).then((result) => {
            const articles = result[1]
            return res.status(200).send({articles})
          })
          .catch((err) => {
            next(err)
          })
    };
    
    returnCommentCount().then((countData) => {
        return countData
    })
    .then((countData) => {
        fetchArticles(countData).then((articles) => {
            return res.status(200).send({articles})
        })
        .catch((err) => {
            next(err)
        })
    })
    .catch((err) => {
        next(err)
    })
};

exports.getArticlesById = (req, res, next) => {
    const {comments} = req.query;
    const {id} = req.params;

    returnCommentCount().then((countData) => {
        return countData
    })
    .then((countData) => {
       fetchArticlesById(id, countData).then((articles) => {
        if (comments) {
            const {comment_count} = articles[0]
            return res.status(200).send({comment_count})
        }else{
            return res.status(200).send(articles[0])
        }
            
        })
        .catch((err) => {
            next(err)
        }) 
    })
    
};

exports.getArticleComments = (req, res, next) => {
    const {article_id} = req.params;

    fetchCommentsByArticleId(article_id).then((comments) => {
       return res.status(200).send({comments}) 
    })
    .catch((err) => {
        next(err)
    })  
};

exports.postArticleComment = (req, res, next) => {
    const {article_id} = req.params;
    const {body} = req;
    const promises = [addComment(article_id, body), checkArticle(article_id)];
    Promise.all(promises)
      .then((promises) => {
        res.status(201).send({ comment: promises[0] });
      })
      .catch((err) => {
        if (err.code === '23502') {
            err.msg = 'Bad Request'
            next(err);
        }else{
            next(err)
        }
        
      });
  };

  exports.patchArticleVotes = (req, res, next) => {
    const {inc_votes} = req.body;
    const {article_id} = req.params;
    
    findVoteCount(article_id, inc_votes).then((newCount) => {
        updateVoteCount(article_id , newCount).then(({rows}) => {
           res.status(201).send(rows[0]); 
        })
    })
    .catch((err) => {
        next(err)
    })
  };

  

