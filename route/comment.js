/**
 * comment API 用來取得、新增貼文下的留言。可取得的資料包含：
 *     * 留言內容
 *     * 留言時間
 *     * 發佈者
 *         * 使用者編號
 *         * 使用者姓名
 *         * 使用者頭像
 */

const express = require('express');
const authenticate = require('./utils/authenticate');
const { jsonParser, urlEncoded } = require('./utils/body-parser');

const apis = express.Router();

const {
    Comment,
    User,
} = require('../models/association.js');

/**
 * 取得某篇貼文下的留言
 */
apis.get('/:imageId(\\d+)', (req, res) => {
    Comment.findAll({
        attributes: [
            'comment',
            'createdAt',
        ],
        where: {
            imageId: req.params.imageId,
        },
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
        ],
        order: [
            ['createdAt', 'DESC'],
        ],
    })
    .then(comments => {
        res.send(comments);
    });
});

/**
 * 新增一筆留言
 * @param {String} comment - 留言內容
 */
apis.post('/:imageId(\\d+)', authenticate, urlEncoded, jsonParser, (req, res) => {
    Comment.create({
        userId: req.session.user.id,
        imageId: req.params.imageId,
        comment: req.body.comment,
    })
    .then(data => {
        Comment.findOne({
            attributes: [
                'comment',
                'createdAt',
            ],
            where: {
                commentId: data.commentId,
            },
        })
        .then(comment => {
            res.send({
                comment: comment.comment,
                createdAt: comment.createdAt,
                author: {
                    userId: req.session.user.id,
                    username: req.session.user.name,
                    icon: req.session.user.icon,
                },
            });
        });
    })
    .catch(err => {
        console.error(err)
        res.status(500).send({ message: err });
    });
});

module.exports = apis;
