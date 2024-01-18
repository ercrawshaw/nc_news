const { removeCommentById , fetchCommentsById } = require('../models/comments.models');

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
}