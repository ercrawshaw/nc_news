const cors = require('cors');
const express = require("express");
const app = express();
const apiRouter = require('./api-router');

app.use(cors());

app.use(express.json());

const { getTopics , getEndpoints } = require('./controllers/topics.controllers');
const { getArticles , getArticlesById , getArticleComments , postArticleComment , patchArticleVotes} = require('./controllers/articles.controllers');
const { deleteCommentById , patchCommentVotes} = require('./controllers/comments.controllers');
const { getUsers } = require ('./controllers/users.controllers')


app.use('/api', apiRouter);

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/users', getUsers);

app.get('/api/articles', getArticles);

app.get('/api/articles/:id', getArticlesById);
app.patch('/api/articles/:article_id', patchArticleVotes);


app.get('/api/articles/:article_id/comments', getArticleComments);
app.post('/api/articles/:article_id/comments', postArticleComment);
app.patch('/api/comments/:comment_id', patchCommentVotes)

app.delete('/api/comments/:comment_id', deleteCommentById);






app.use((err ,req, res, next) => {
    if (err.msg === "Not Found" || err.code === '23503') {
      res.status(404).send({msg: 'Not Found'})
    }else{
      next(err);
    }
  });
  app.use((err, req, res, next) => {
    if (err.code ==='22P02' || err.msg === 'Bad Request') {
        res.status(400).send({msg: 'Bad Request'})
    }else{
        next(err);
    }
  })


module.exports = app;


