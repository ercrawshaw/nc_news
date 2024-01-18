const {fetchArticles , returnCommentCount , fetchArticlesById , checkArticle , findVoteCount , updateVoteCount } = require('../models/articles.models');
const {fetchCommentsByArticleId , addComment} = require('../models/comments.models');


exports.getArticles = (req, res, next) => {
    
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
};

exports.getArticlesById = (req, res, next) => {
    const id = req.params.id

    returnCommentCount().then((countData) => {
        return countData
    })
    .then((countData) => {
       fetchArticlesById(id, countData).then((articles) => {
            return res.status(200).send(articles[0])
        })
        .catch((err) => {
            next(err)
        }) 
    })
    
};

exports.getArticleComments = (req, res, next) => {
    const id = req.params.article_id;

    fetchCommentsByArticleId(id).then((comments) => {
       return res.status(200).send({comments}) 
    })
    .catch((err) => {
        next(err)
    })  
};

exports.postArticleComment = (req, res, next) => {
    const id = req.params.article_id;
    const body = req.body;
    const promises = [addComment(id, body), checkArticle(id)];
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
    const voteInc = req.body.inc_votes;
    const id = req.params.article_id;
    
    findVoteCount(id, voteInc).then((newCount) => {
        updateVoteCount(id , newCount).then(({rows}) => {
           res.status(201).send(rows[0]); 
        })
    })
    .catch((err) => {
        next(err)
    })
  };

  

