const { fetchTopics , fetchArticles } = require('../models/topics.models');


exports.getEndpoints = (req, res, next) => {
        const endpointData = require('../../endpoints.json'); 
       return res.status(200).send({endpointData})               
};

exports.getTopics = (req, res, next) => {
        fetchTopics().then((topics) => {
           return res.status(200).send({topics}) 
        })
};

exports.getArticles = (req, res, next) => {
        const id = req.params.id
        
        fetchArticles(id).then((articles) => {
                return res.status(200).send({articles})
        })
        .catch((err) => {
                next(err)
            })
};



