const { fetchTopics } = require('../models/topics.models');


exports.getEndpoints = (req, res, next) => {
        const endpointData = require('../../endpoints.json'); 
       return res.status(200).send({endpointData})               
};

exports.getTopics = (req, res, next) => {
        fetchTopics().then((topics) => {
           return res.status(200).send({topics}) 
        })
};




