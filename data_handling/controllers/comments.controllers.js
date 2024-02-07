const { commentData } = require('../../db/data/test-data');
const { removeCommentById , fetchCommentsById, findCommentVoteCount, updateCommentVoteCount } = require('../models/comments.models');

exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params

    fetchCommentsById(comment_id).then(() => {
       removeCommentById(comment_id).then(() => {
       return res.status(204).send() 
        }) 
    })
    .catch((err) => {
        next(err)
    })  
};

exports.patchCommentVotes = (req, res, next) => {
    const {inc_votes} = req.body;
    const {comment_id} = req.params;
    
    updateCommentVoteCount(comment_id, inc_votes).then((result) => {
        return res.status(201).send(result)
    })
    .catch((err) => {
        next(err)
    })
  };

  exports.patchCommentVotes = (req, res, next) => {
    const {inc_votes} = req.body;
    const {comment_id} = req.params;
    
    findCommentVoteCount(comment_id, inc_votes).then((newCount) => {
        updateCommentVoteCount(comment_id , newCount).then(({rows}) => {
           res.status(201).send(rows[0]); 
        })
    })
    .catch((err) => {
        next(err)
    })
  };
