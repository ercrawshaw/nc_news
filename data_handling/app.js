const express = require("express");
const app = express();

const { getTopics , getEndpoints , getArticles } = require('./controllers/topics.controllers');

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);
app.get('/api/articles/:id', getArticles);


app.use((err ,req, res, next) => {
    if (err.msg === "Not Found") {
      res.status(404).send({msg: 'Not Found'})
    }else{
      next(err);
    }
  });
  app.use((err, req, res, next) => {
    if (err.code ==='42703') {
        res.status(400).send({msg: 'Bad Request'})
    }else{
        next(err);
    }
  })


module.exports = app;


