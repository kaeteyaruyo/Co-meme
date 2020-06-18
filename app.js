const path = require('path');
const bcrypt = require('bcrypt');
const express = require('express');
const parser = require('body-parser');
const { Sequelize, Op } = require('sequelize');

const config = require('./config.js');
const authenticate = require('./route/utils/authenticate');
const daysAgo = require('./route/utils/days-ago');
const session = require('./route/utils/session');
const upload = require('./route/utils/upload');
const imagesAPI = require('./route/images');
const usersAPI = require('./route/users');
const tagsAPI = require('./route/tags');
const commentAPI = require('./route/comment');

const {
    Comment,
    Follower,
    Image,
    ImageTag,
    Tag,
    User,
    TagFollower,
} = require('./models/association.js');

const app = express();
const root = process.cwd();

app.set('view engine', 'pug');
app.set('views', path.join(root, '/static/pug'));
app.use(express.static(path.join(root, '/static')));
app.use(session);
app.use(parser.urlencoded({
    limit: '5GB',
    extended: true,
}));
app.use(parser.json({
    limit: '5GB',
    type: '*/json',
}));

app.use('/api/images', imagesAPI);
app.use('/api/users', usersAPI);
app.use('/api/tags', tagsAPI);
app.use('/api/comment', commentAPI);

app.use(function (req, res, next) {
    if (req.session.user) {
        res.locals.activeUser = req.session.user;
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

app.get('/', sidebarData, async (req, res) => {
    res.render('index', {
        title: '首頁',
    });
});

app.get('/recommend', sidebarData, async (req, res) => {
    res.render('recommend', {
        title: '為你推薦',
    });
});

app.get('/latest', sidebarData, async (req, res) => {
    res.render('latest', {
        title: '最新內容',
    });
});

app.get('/tag/:id', sidebarData, async (req, res, next) => {
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
        res.render('tag', {
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
                .then(image => image.content),
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
    })
    .catch(err => {
        console.error(err)
        res.status(500);
        next();
    });
});

app.get('/image/:id', sidebarData, (req, res) => {
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
        res.render('image', {
            title: image.description,
            image
        });
    })
    .catch(err => {
        console.error(err)
        res.status(500);
        next();
    });
});

app.get('/profile/:id', sidebarData, async (req, res) => {
    User.findOne({
        where: {
            userId: req.params.id
        },
        attributes: [
            'userId',
            'username',
            'icon',
            'followerCount',
        ],
    })
    .then(user => {
        res.render('profile', {
            title: `${ user.username }的頁面`,
            user,
        });
    })
    .catch(err => {
        console.error(err)
        res.status(500);
        next();
    });
});

app.get('/upload', authenticate, (req, res) => {
    res.render('upload', {
        title: '上傳',
    });
});

app.post('/upload', authenticate, upload.single('image'), async (req, res) => {
    if(!req.file){
        res.redirect('/');
    }
    else {
        Image.create({
            content: req.file.buffer,
            category: req.body.category,
            userId: req.session.user.id,
            description: req.body.description,
        })
        .then(async record => {
            await Promise.all(req.body.tags.map(tag => Tag.findOrCreate({
                where: {
                    tag,
                },
            })
            .then(res => ImageTag.create({
                imageId: record.imageId,
                tagId: res[0].tagId,
            }))));
            // TODO: redirect to index
            res.redirect(`/image/${ record.imageId }`);
        })
        .catch(error => {
            res.status(500).send({ error });
        });
    }
});

app.get('/signup', (req, res) => {
    if(req.session.user){
        res.redirect(`/profile/${ req.session.username }`);
    }
    else {
        res.render('signup', {
            title: '會員註冊',
        });
    }
});

app.post('/signup', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        birthday: new Date(`${ req.body.birthyear }-${ req.body.birthmonth }-${ req.body.birthdate }`),
    })
    .then(() => {
        res.redirect('/signin');
    })
    .catch(err => {
        console.log(err.errors)
        if(err.errors[0].type === 'unique violation'){
            // TODO: frontend error message display
            res.redirect('/signup');
        }
        else{
            res.status(500).send('Server side error occured');
        }
    });
});

app.get('/signin', (req, res) => {
    if(req.session.user){
        res.redirect(`/profile/${ req.session.username }`);
    }
    else {
        res.render('signin', {
            title: '會員登入',
        });
    }
});

app.post('/signin', async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        },
        attributes: [
            'userId',
            'username',
            'password',
            'icon',
        ],
    });
    bcrypt.compare(req.body.password, user.password)
    .then(matched => {
        if(matched){
            req.session.user = {
                id: user.userId,
                name: user.username,
                icon: user.icon,
            }
            res.redirect('/');
        }
        else {
            // TODO: frontend error message display
            res.redirect('signin');
        }
    });
});

app.get('/signout', async (req, res) => {
    delete req.session.user;
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

app.listen(config.port, () => {
    console.log(`Listen on ${ config.port }`);
});
