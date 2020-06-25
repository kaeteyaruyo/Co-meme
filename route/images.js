/**
 * image API 用來取得包含在時間軸、圖片牆、推薦圖片列的貼文縮圖相關內容，包含：
 *     * 圖片編號
 *     * 圖片本體
 *     * 發佈時間
 *     * 作者
 *         * 使用者編號
 *         * 使用者姓名
 *         * 使用者頭像
 *     * 按讚的使用者列表（只含使用者編號）
 * 本 api 提供分頁功能，一頁有 12 筆資料。
 */

const express = require('express');
const { Sequelize, Op } = require('sequelize');
const authenticate = require('./utils/authenticate');
const daysAgo = require('./utils/days-ago');

const apis = express.Router();
const pageSize = 12;

const {
    Image,
    Tag,
    User,
    Follower,
    TagFollower,
    LikeImage,
} = require('../models/association.js');

/**
 * 取得已登入使用者的時間軸，需確認登入狀態
 * @param {Number} page - 第幾頁，從 0 開始計算
 * @param {Number} category - 類別，0 為梗圖， 1 為長輩圖，沒有給的話就會全部都拿
 */
apis.get('/timeline', authenticate, (req, res) => {
    Promise.all([
        Follower.findAll({
            where: {
                followerId: req.session.user.id,
            },
            attributes: [
                'userId',
            ],
        })
        .then(users => Image.findAll({
            where: {
                userId: users.map(user => user.userId).concat(req.session.user.id),
            },
            attributes: [
                'imageId',
            ],
        })),
        TagFollower.findAll({
            where: {
                userId: req.session.user.id,
            },
            attributes: [
                'tagId',
            ],
        })
        .then(tags => Image.findAll({
            attributes: [
                'imageId',
            ],
            include: [
                {
                    model: Tag,
                    as: 'tags',
                    where: {
                        tagId: tags.map(tag => tag.tagId),
                    },
                    attributes: [],
                    through: {
                        attributes: [],
                    },
                }
            ],
        })),
    ])
    .then(data => {
        Image.findAll({
            where: req.query.category ? {
                category: req.query.category,
                imageId: Array.from(new Set(data[0].map(image => image.imageId).concat(data[1].map(image => image.imageId)))),
            } : {
                imageId: Array.from(new Set(data[0].map(image => image.imageId).concat(data[1].map(image => image.imageId)))),
            },
            attributes: [
                'imageId',
                'content',
                'createdAt',
            ],
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: [
                        'userId',
                        'username',
                        'icon',
                    ],
                },
                {
                    model: User,
                    as: 'likedUsers',
                    attributes: [
                        'userId',
                    ],
                },
            ],
            order: [
                ['createdAt', 'DESC'],
            ],
            offset: req.query.page * pageSize,
            limit: pageSize,
        })
        .then(images => {
            res.send(images);
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({ message: err });
        });
    })
    .catch(err => {
        console.error(err)
        res.status(500).send({ message: err });
    });
});

/**
 * 透過協同過濾為使用者推薦可能會喜歡的貼文，需檢查登入狀態
 * @param {Number} page - 第幾頁，從 0 開始計算
 * @param {Number} category - 類別，0 為梗圖， 1 為長輩圖，沒有給的話就會全部都拿
 */
apis.get('/recommend', authenticate, (req, res) => {
    // TODO: implement this route
    res.status(500).send({ message: 'This route is not yet implemented.' });
})

/**
 * 取得最新貼文，單純以發文時間排序
 * @param {Number} page - 第幾頁，從 0 開始計算
 * @param {Number} category - 類別，0 為梗圖， 1 為長輩圖，沒有給的話就會全部都拿
 */
apis.get('/latest', (req, res) => {
    Image.findAll({
        where: req.query.category ? {
            category: req.query.category,
        } : { },
        attributes: [
            'imageId',
            'content',
            'createdAt',
        ],
        include: [
            {
                model: User,
                as: 'author',
                attributes: [
                    'userId',
                    'username',
                    'icon',
                ],
            },
            {
                model: User,
                as: 'likedUsers',
                attributes: [
                    'userId',
                ],
                through: {
                    attributes: [],
                },
            },
        ],
        order: [
            ['createdAt', 'DESC'],
        ],
        offset: req.query.page * pageSize,
        limit: pageSize,
    })
    .then(images => {
        res.send(images);
    })
    .catch(err => {
        console.error(err)
        res.status(500).send({ message: err });
    });
});

/**
 * 取得熱門的貼文，以一週內按讚數排序
 * @param {Number} page - 第幾頁，從 0 開始計算
 * @param {Number} category - 類別，0 為梗圖， 1 為長輩圖，沒有給的話就會全部都拿
 */
apis.get('/hot', (req, res) => {
    LikeImage.findAll({
        where: {
            createdAt: {
                [Op.gte]: daysAgo(7),
            },
        },
        attributes: [
            'imageId',
        ],
        group: [
            'imageId'
        ],
        order: [
            [Sequelize.fn('COUNT', Sequelize.col('userId')), 'DESC'],
        ],
        offset: req.query.page * pageSize,
        limit: pageSize,
    })
    .then(data => {
        Image.findAll({
            where: req.query.category ? {
                imageId: data.map(image => image.imageId),
                category: req.query.category,
            } : {
                imageId: data.map(image => image.imageId),
            },
            attributes: [
                'imageId',
                'content',
                'createdAt',
            ],
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: [
                        'userId',
                        'username',
                        'icon',
                    ],
                },
                {
                    model: User,
                    as: 'likedUsers',
                    attributes: [
                        'userId',
                    ],
                    through: {
                        attributes: [],
                    },
                },
            ],
        })
        .then(images => {
            res.send(images.sort((a, b) => b.likedUsers.length - a.likedUsers.length));
        });
    })
    .catch(err => {
        res.status(500).send({ message: err });
    });
});

/**
 * 取得有某標籤的貼文
 * @param {Number} page - 第幾頁，從 0 開始計算
 * @param {Number} category - 類別，0 為梗圖， 1 為長輩圖，沒有給的話就會全部都拿
 */
apis.get('/tag/:tagId(\\d+)', (req, res) => {
    Image.findAll({
        where: req.query.category ? {
            category: req.query.category,
        } : { },
        attributes: [
            'imageId',
            'content',
            'createdAt',
        ],
        include: [
            {
                model: User,
                as: 'author',
                attributes: [
                    'userId',
                    'username',
                    'icon',
                ],
            },
            {
                model: User,
                as: 'likedUsers',
                attributes: [
                    'userId',
                ],
                through: {
                    attributes: [],
                },
            },
            {
                model: Tag,
                as: 'tags',
                attributes: [],
                through: {
                    attributes: [],
                },
                where: {
                    tagId: req.params.tagId,
                }
            }
        ],
        order: [
            ['createdAt', 'DESC'],
        ],
        offset: req.query.page * pageSize,
        limit: pageSize,
    })
    .then(images => {
        res.send(images);
    })
    .catch(err => {
        console.error(err)
        res.status(500).send({ message: err });
    });
});

/**
 * 取得某使用者所發佈的貼文
 * @param {Number} page - 第幾頁，從 0 開始計算
 * @param {Number} category - 類別，0 為梗圖， 1 為長輩圖，沒有給的話就會全部都拿
 */
apis.get('/user/:userId(\\d+)', (req, res) => {
    Image.findAll({
        where: req.query.category ? {
            category: req.query.category,
        } : { },
        attributes: [
            'imageId',
            'content',
            'createdAt',
        ],
        include: [
            {
                model: User,
                as: 'author',
                attributes: [
                    'userId',
                    'username',
                    'icon',
                ],
                where: {
                    userId: req.params.userId,
                }
            },
            {
                model: User,
                as: 'likedUsers',
                attributes: [
                    'userId',
                ],
                through: {
                    attributes: [],
                },
            },
        ],
        order: [
            ['createdAt', 'DESC'],
        ],
        offset: req.query.page * pageSize,
        limit: pageSize,
    })
    .then(images => {
        res.send(images);
    })
    .catch(err => {
        console.error(err)
        res.status(500).send({ message: err });
    });
});

/**
 * 取得跟某圖片相似的圖片，固定取得 5 張
 */
apis.get('/similar/:imageId(\\d+)', authenticate, (req, res) => {
    // TODO: implement this route
    res.status(500).send({ message: 'This route is not yet implemented.' });
})

/**
 * 對某張圖片按讚或取消按讚，需登入
 */
apis.post('/like/:imageId(\\d+)', authenticate, (req, res) => {
    LikeImage.findOrCreate({
        where: {
            userId: req.session.user.id,
            imageId: Number.parseInt(req.params.imageId),
        },
        defaults: {
            userId: req.session.user.id,
            imageId: Number.parseInt(req.params.imageId),
        },
    })
    .then(async ([result, created]) => {
        if(!created){
            await LikeImage.destroy({
                where: {
                    userId: req.session.user.id,
                    imageId: Number.parseInt(req.params.imageId),
                }
            })
        }
        LikeImage.count({
            where: {
                imageId: Number.parseInt(req.params.imageId),
            }
        })
        .then(count => {
            res.send({ likes: count });
        });
    })
    .catch(err => {
        console.error(err)
        res.status(500).send({ message: err });
    });
});

module.exports = apis;
