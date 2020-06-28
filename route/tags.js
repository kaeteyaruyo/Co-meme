/**
 * tag API 用來取得 tag card 上所需的資料，包含：
 *    * 標籤編號
 *    * 標籤名稱
 *    * 本日新增貼文數
 *    * 追蹤者列表
 *    * 有這個標籤的其中一張圖片（取最新的那一張）
 */

const express = require('express');
const { Sequelize, Op } = require('sequelize');
const authenticate = require('./utils/authenticate');
const daysAgo = require('./utils/days-ago');

const apis = express.Router();

const {
    Image,
    Tag,
    User,
    TagFollower,
} = require('../models/association.js');

/**
 * 透過協同過濾為使用者推薦可能會喜歡的標籤，需檢查登入狀態
 * @param {Number} count - 需要回傳幾個標籤
 */
apis.get('/recommend', authenticate, (req, res) => {
    // TODO: implement this route
    res.status(500).send({ message: 'This route is not yet implemented.' });
})

/**
 * 取得熱門的標籤，以一週內發文數排序
 * @param {Number} count - 需要回傳幾個標籤
 */
apis.get('/hot', (req, res) => {
    Tag.findAll({
        attributes: [
            'tagId',
            'tag',
            [Sequelize.fn('COUNT', Sequelize.col('images.imageId')), 'imageCount'],
        ],
        include: [
            {
                model: Image,
                as: 'images',
                where: {
                    createdAt: {
                        [Op.gte]: daysAgo(7),
                    },
                },
            }
        ],
        group: ['tagId'],
        order: [
            [Sequelize.literal('imageCount'), 'DESC'],
        ],
        includeIgnoreAttributes : false,
    })
    .then(data => {
        Promise.all(data.slice(0, req.query.count).map(async tag => ({
            tagId: tag.tagId,
            tag: tag.tag,
            posts: await Image.count({
                where: {
                    createdAt: {
                        [Op.gte]: daysAgo(1),
                    },
                },
                include: [
                    {
                        model: Tag,
                        as: 'tags',
                        where: {
                            tagId: tag.tagId,
                        }
                    }
                ],
                includeIgnoreAttributes : false,
            }),
            thumbnail: await Image.findOne({
                attributes: [
                    'content',
                ],
                include: [
                    {
                        model: Tag,
                        as: 'tags',
                        where: {
                            tagId: tag.tagId,
                        }
                    }
                ],
                order: [
                    ['imageId', 'DESC'],
                ],
                includeIgnoreAttributes : false,
            })
            .then(image => image.content)
            .catch(err => {
                console.error(err)
                return null;
            }),
            followers: await TagFollower.findAll({
                attributes: [
                    'userId',
                ],
                where:{
                    tagId: tag.tagId,
                },
            }),
        })))
        .then(tags => {
            res.send(tags);
        });
    })
    .catch(err => {
        console.error(err)
        res.status(500).send({ message: err });
    });
});

/**
 * 取得某使用者有追蹤的標籤
 */
apis.get('/following/:userId(\\d+)', (req, res) => {
    Tag.findAll({
        attributes: [
            'tagId',
            'tag',
        ],
        include: [
            {
                model: User,
                as: 'followers',
                where: {
                    userId: req.params.userId,
                },
            },
        ],
        includeIgnoreAttributes : false,
    })
    .then(data => {
        Promise.all(data.map(async tag => ({
            tagId: tag.tagId,
            tag: tag.tag,
            posts: await Image.count({
                where: {
                    createdAt: {
                        [Op.gte]: daysAgo(1),
                    },
                },
                include: [
                    {
                        model: Tag,
                        as: 'tags',
                        where: {
                            tagId: tag.tagId,
                        }
                    }
                ],
                includeIgnoreAttributes : false,
            }),
            thumbnail: await Image.findOne({
                attributes: [
                    'content',
                ],
                include: [
                    {
                        model: Tag,
                        as: 'tags',
                        where: {
                            tagId: tag.tagId,
                        }
                    }
                ],
                order: [
                    ['imageId', 'DESC'],
                ],
                includeIgnoreAttributes : false,
            })
            .then(image => image.content)
            .catch(err => {
                console.error(err)
                return null;
            }),
            followers: await TagFollower.findAll({
                attributes: [
                    'userId',
                ],
                where:{
                    tagId: tag.tagId,
                },
            }),
        })))
        .then(tags => {
            res.send(tags);
        });
    })
    .catch(err => {
        res.status(500).send({ message: err });
    });
});

/**
 * 追蹤或取消追蹤某標籤，需登入
 */
apis.post('/follow/:tagId(\\d+)', authenticate, (req, res) => {
    TagFollower.findOrCreate({
        where: {
            userId: req.user.id,
            tagId: Number.parseInt(req.params.tagId),
        },
        defaults: {
            userId: req.user.id,
            tagId: Number.parseInt(req.params.tagId),
        },
    })
    .then(async ([result, created]) => {
        if(!created){
            await TagFollower.destroy({
                where: {
                    userId: req.user.id,
                    tagId: Number.parseInt(req.params.tagId),
                }
            })
        }
        TagFollower.count({
            where: {
                tagId: Number.parseInt(req.params.tagId),
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
