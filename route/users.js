/**
 * image API 用來取得 user card 上所需的資料，包含：
 *     * 使用者編號
 *     * 使用者姓名
 *     * 使用者頭像
 *     * 追蹤者列表（只含使用者編號）
 */

const express = require('express');
const { Sequelize, Op } = require('sequelize');
const authenticate = require('./utils/authenticate');
const daysAgo = require('./utils/days-ago');

const apis = express.Router();

const {
    Follower,
    Image,
    User,
} = require('../models/association.js');

/**
 * 透過協同過濾為使用者推薦可能會喜歡的創作者，需檢查登入狀態
 * @param {Number} count - 需要回傳幾位使用者
 */
apis.get('/recommend', authenticate, (req, res) => {
    // TODO: implement this route
    // TODO: don't recommend self
    res.status(500).send({ message: 'This route is not yet implemented.' });
})

/**
 * 取得熱門的使用者，以一週內發文數排序
 * @param {Number} count - 需要回傳幾位使用者
 */
apis.get('/hot', (req, res) => {
    Image.findAll({
        where: {
            createdAt: {
                [Op.gte]: daysAgo(60), // TODO: change this to 7
            },
        },
        attributes: [
            'userId',
        ],
        group: [
            'userId'
        ],
        order: [
            [Sequelize.fn('COUNT', Sequelize.col('imageId')), 'DESC'],
        ],
        limit: Number.parseInt(req.query.count),
    })
    .then(data => {
        User.findAll({
            where: {
                userId: data.map(user => user.userId),
            },
            attributes: [
                'userId',
                'username',
                'icon',
                'userId',
            ],
            include: [
                {
                    model: User,
                    as: 'followers',
                    attributes: [
                        'userId',
                    ],
                    through: {
                        attributes: [],
                    },
                },
            ],
        })
        .then(users => {
            res.send(users.sort((a, b) => b.followers.length - a.followers.length));
        })
    })
    .catch(err => {
        res.status(500).send({ message: err });
    });
});

/**
 * 取得某使用者有追蹤的人
 */
apis.get('/following/:userId(\\d+)', (req, res) => {
    Follower.findAll({
        where: {
            followerId: req.params.userId,
        },
    })
    .then(data => {
        User.findAll({
            where: {
                userId: data.map(user => user.userId),
            },
            attributes: [
                'userId',
                'username',
                'icon',
                'userId',
            ],
            include: [
                {
                    model: User,
                    as: 'followers',
                    attributes: [
                        'userId',
                    ],
                    through: {
                        attributes: [],
                    },
                },
            ],
        })
        .then(users => {
            res.send(users);
        });
    })
    .catch(err => {
        res.status(500).send({ message: err });
    });
});

/**
 * 追蹤或取消追蹤某使用者，需登入
 */
apis.post('/follow/:userId(\\d+)', authenticate, (req, res) => {
    Follower.findOrCreate({
        where: {
            followerId: req.user.id,
            userId: Number.parseInt(req.params.userId),
        },
        defaults: {
            followerId: req.user.id,
            userId: Number.parseInt(req.params.userId),
        },
    })
    .then(async ([result, created]) => {
        if(!created){
            await Follower.destroy({
                where: {
                    followerId: req.user.id,
                    userId: Number.parseInt(req.params.userId),
                }
            })
        }
        Follower.count({
            where: {
                userId: Number.parseInt(req.params.userId),
            }
        })
        .then(count => {
            res.send({
                followers: count,
                following: created,
            });
        });
    })
    .catch(err => {
        console.error(err)
        res.status(500).send({ message: err });
    });
});

module.exports = apis;
