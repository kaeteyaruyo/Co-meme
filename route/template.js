const express = require('express');
const { Sequelize, Op } = require('sequelize');
const authenticate = require('./utils/authenticate');

const apis = express.Router();
const pageSize = 20;

const {
    Template,
    Text,
    User,
} = require('../models/association.js');

/**
 * @param {Number} page - 第幾頁，從 0 開始計算
 * @param {Number} category - 類別，0 為梗圖， 1 為長輩圖，沒有給的話就會全部都拿
 */
apis.get('/', authenticate, (req, res) => {
    Template.findAll({
        where: req.query.category ? {
            category: req.query.category,
        } : { },
        include: [
            {
                model: User,
                as: 'author',
                attributes: [
                    'userId',
                    'username',
                ],
            },
            {
                model: Text,
                as: 'texts',
                attributes: [
                    'top',
                    'left',
                    'fontSize',
                    'fill',
                ],
            },
        ],
        order: [
            ['usedCount', 'DESC'],
        ],
        offset: req.query.page * pageSize,
        limit: pageSize,
    })
    .then(templates => {
        res.send(templates);
    })
    .catch(err => {
        console.error(err)
        res.status(500).send({ message: err });
    });
});

apis.get('/:id', (req, res) => {
    Template.findOne({
        where: {
            templateId: req.params.id,
        },
        attributes: [
            'templateId',
            'content',
            'title',
            'description',
        ],
        include: [
            {
                model: User,
                as: 'author',
                attributes: [
                    'userId',
                    'username',
                ],
            },
        ],
    })
    .then(template => {
        res.send(template);
    })
    .catch(err => {
        console.error(err)
        res.status(500).send({ message: err });
    });
});

module.exports = apis;
