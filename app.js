const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const bcrypt = require('bcrypt');
const express = require('express');
const passport = require('passport');
const Hashids = require('hashids/cjs');
const MobileDetect = require('mobile-detect');
const { Sequelize, Op } = require('sequelize');

const config = require('./config.js');
const upload = require('./route/utils/upload');
const session = require('./route/utils/session');
const daysAgo = require('./route/utils/days-ago');
const authenticate = require('./route/utils/authenticate');
const { urlEncoded, jsonParser } = require('./route/utils/body-parser');

const authAPI = require('./route/auth');
const tagsAPI = require('./route/tags');
const usersAPI = require('./route/users');
const imagesAPI = require('./route/images');
const commentAPI = require('./route/comment');

const {
    Tag,
    User,
    Image,
    Password,
    ImageTag,
    TagFollower,
} = require('./models/association');
const database = require('./models/connect');

const sslOptions = {
    key: fs.readFileSync(config.ssl.key_path),
    ca: fs.readFileSync(config.ssl.ca_path),
    cert: fs.readFileSync(config.ssl.cert_path)
};

const app = express();
const root = process.cwd();
const hashids = new Hashids(config.session.secret, 20);

app.set('view engine', 'pug');
app.set('views', path.join(root, '/static/pug'));
app.use(express.static(path.join(root, '/static')));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authAPI);
app.use('/api/tags', tagsAPI);
app.use('/api/users', usersAPI);
app.use('/api/images', imagesAPI);
app.use('/api/comment', commentAPI);

app.use(function (req, res, next) {
    if (req.user) {
        res.locals.activeUser = req.user;
    }
    next();
})

async function sidebarData(req, res, next){
    res.locals.sidebar = {};
    res.locals.sidebar.tags = await Tag.findAll({
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
    .then(tags => {
        return tags.slice(0, 10).map(tag => ({
            tagId: tag.tagId,
            tag: tag.tag,
        }));
    })
    .catch(err => {
        res.status(500).send({ message: err });
    });
    next();
}

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/', sidebarData, (req, res) => {
    const md = new MobileDetect(req.headers['user-agent']);
    res.render(`${ md.mobile() ? 'mobile/' : '' }index`, {
        title: '首頁',
    });
});

app.get('/recommend', sidebarData, (req, res) => {
    res.render('recommend', {
        title: '為你推薦',
    });
});

app.get('/latest', sidebarData, (req, res) => {
    res.render('latest', {
        title: '最新內容',
    });
});

app.get('/image/:id', sidebarData, (req, res, next) => {
    Image.findOne({
        where: {
            imageId: req.params.id,
        },
        attributes: [
            'imageId',
            'content',
            'description',
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
                include: [
                    {
                        model: User,
                        as: 'followers',
                        attributes: [
                            'userId',
                        ],
                    }
                ],
            },
            {
                model: User,
                as: 'likedUsers',
                attributes: [
                    'userId',
                ],
            },
            {
                model: Tag,
                as: 'tags',
                attributes: [
                    'tag',
                    'tagId',
                ],
            },
        ]
    })
    .then(image => {
        if(image){
            res.render('image', {
                title: image.description,
                image
            });
        }
        else {
            res.status(404);
            next();
        }
    })
    .catch(err => {
        console.error(err)
        res.status(500);
        next();
    });
});

app.get('/tag/:id', sidebarData, (req, res, next) => {
    Tag.findOne({
        attributes: [
            'tagId',
            'tag',
        ],
        where: {
            tagId: req.params.id,
        },
    })
    .then(async tag => {
        if(tag){
            const md = new MobileDetect(req.headers['user-agent']);
            res.render(`${ md.mobile() ? 'mobile/' : '' }tag`, {
                title: tag.tag,
                tag: {
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
                },
            });
        }
        else {
            res.status(404);
            next();
        }
    })
    .catch(err => {
        console.error(err)
        res.status(500);
        next();
    });
});

app.get('/profile/:id', sidebarData, (req, res, next) => {
    User.findOne({
        where: {
            userId: req.params.id
        },
        attributes: [
            'userId',
            'username',
            'icon',
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
    .then(user => {
        if(user){
            const md = new MobileDetect(req.headers['user-agent']);
            res.render(`${ md.mobile() ? 'mobile/' : '' }profile`, {
                title: `${ user.username }的頁面`,
                user,
            });
        }
        else {
            res.status(404);
            next();
        }
    })
    .catch(err => {
        console.error(err)
        res.status(500);
        next();
    });
});

app.get('/upload', (req, res, next) => {
    if(!req.user){
        res.redirect('/signin');
    }
    next();
}, (req, res) => {
    res.render('upload', {
        title: '上傳',
    });
});

app.post('/upload', authenticate, urlEncoded, jsonParser, upload.single('image'), (req, res) => {
    if(!req.file){
        res.redirect('/');
    }
    else {
        database.transaction(t => {
            return Image.create({
                content: req.file.buffer,
                category: req.body.category,
                userId: req.user.id,
                description: req.body.description,
            }, {
                transaction: t
            })
            .then(record => {
                if(req.body.tags){
                    return Promise.all(req.body.tags.map(tag => Tag.findOrCreate({
                        where: {
                            tag,
                        },
                    })
                    .then(res => ImageTag.create({
                        imageId: record.imageId,
                        tagId: res[0].tagId,
                    }, {
                        transaction: t
                    }))));
                }
            });
        })
        .then(result => {
            res.redirect('/');
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({ message: err });
        });
    }
});

app.get('/template', (req, res) => {
    res.render('template', {
        title: '模板',
    });
});

app.get('/signup', (req, res) => {
    if(req.user){
        res.redirect('/');
    }
    else {
        res.render('signup', {
            title: '會員註冊',
        });
    }
});

app.post('/signup', urlEncoded, jsonParser, (req, res) => {
    Password.findOne({
        where: {
            email: req.body.email,
        },
    })
    .then(user => {
        if(user !== null){
            throw new Error('User existed');
        }
        else {
            return bcrypt.hash(req.body.password, 10)
            .then(hash => {
                return database.transaction(t => {
                    return User.create({
                        username: req.body.username,
                        email: req.body.email,
                        birthday: new Date(`${ req.body.birthyear }-${ req.body.birthmonth }-${ req.body.birthdate }`),
                        host: 'local',
                    }, {
                        transaction: t,
                    })
                    .then(user => {
                        return user.update({
                            hash: hashids.encode(user.userId),
                        }, {
                            transaction: t,
                        });
                    })
                    .then(user => {
                        return Password.create({
                            userId: user.userId,
                            email: user.email,
                            password: hash,
                        }, {
                            transaction: t,
                        });
                    })
                });
            })
            .then(() => {
                res.redirect('/signin');
            })
        }
    })
    .catch(err => {
        console.error(err)
        // TODO: error type checking
        res.render('signup', {
            title: '會員註冊',
            error: {
                message: '此E-mail已有使用者註冊',
            },
        });
    });
});

app.get('/signin', (req, res) => {
    if(req.user){
        res.redirect('/');
    }
    else {
        res.render('signin', {
            title: '會員登入',
        });
    }
});

app.get('/signout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.use(function(req, res, next) {
    if(res.status === 500){
        // TODO: 500 error page
        res.status(500).render('error', {
            title: '伺服器錯誤',
        });
    }
    else {
        next();
    }
});

app.use(function(req, res, next) {
    res.status(404).render('error', {
        title: '查無內容',
    });
});

http.createServer(app).listen(config.httpPort);
// https.createServer(sslOptions, app).listen(config.httpsPort);

