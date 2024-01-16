const {fetchArticles , returnCommentCount , fetchArticlesById } = require('../models/articles.models');
const {fetchCommentsByArticleId } = require('../models/comments.models');


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

    
}
