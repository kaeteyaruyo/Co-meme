const path = require('path');
const bcrypt = require('bcrypt');
const express = require('express');
const parser = require('body-parser');
const { Op } = require('sequelize');

const config = require('./config.js');
const authenticate = require('./route/authenticate');
const session = require('./route/session');
const upload = require('./route/upload');
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
        ],
        limit: 5,
    });
    next();
}

app.get('/', sidebarData, async (req, res) => {
    const dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - 1);

    let posts;
    if(req.session.user){
        posts = await Image.findAll({
            attributes: [
                'imageId',
                'content',
                'likes',
                'createdAt',
            ],
            include: [
                {
                    model: User,
                    as: 'author',
                    where: {
                        userId: [req.session.user.id]
                    },
                    attributes: [
                        'username',
                        'icon',
                    ],
                },
            ],
            limit: 10,
        });
    }
    else {
        posts = await Image.findAll({
            order: [
                ['createdAt', 'DESC'],
            ],
            attributes: [
                'imageId',
                'content',
                'likes',
                'createdAt',
            ],
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: [
                        'username',
                        'icon',
                    ],
                },
            ],
            limit: 10,
        });
    }

    const recommendUsers = await User.findAll({
        attributes: [
            'userId',
            'username',
            'followerCount',
            'icon',
        ],
        order: [
            ['followerCount', 'DESC'],
        ],
        limit: 4,
    });

    const recommendTags = await Tag.findAll({
        attributes: [
            'tagId',
            'tag',
        ],
        include: [
            {
                model: Image,
                as: 'images',
                attributes: [
                    'content'
                ],
            },
        ],
        limit: 2,
    });

    res.render('index', {
        title: '首頁',
        posts,
        recommendUsers,
        recommendTags,
    });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/recommend', sidebarData, async (req, res) => {
    const images = await Image.findAll({
        order: [
            ['createdAt', 'DESC'],
        ],
        attributes: [
            'imageId',
            'content',
            'likes',
            'createdAt',
        ],
        include: [
            {
                model: User,
                as: 'author',
                attributes: [
                    'username',
                    'icon',
                ],
            },
        ],
    });

    const recommendUsers = await User.findAll({
        attributes: [
            'userId',
            'username',
            'followerCount',
            'icon',
        ],
        order: [
            ['followerCount', 'DESC'],
        ],
        limit: 8,
    });

    const recommendTags = await Tag.findAll({
        attributes: [
            'tagId',
            'tag',
        ],
        include: [
            {
                model: Image,
                as: 'images',
                attributes: [
                    'content'
                ],
            },
        ],
        limit: 8,
    });

    res.render('recommend', {
        title: '為你推薦',
        images,
        recommendUsers,
        recommendTags,
    });
});

app.get('/latest', sidebarData, async (req, res) => {
    const images = await Image.findAll({
        order: [
            ['createdAt', 'DESC'],
        ],
        attributes: [
            'imageId',
            'content',
            'likes',
            'createdAt',
        ],
        include: [
            {
                model: User,
                as: 'author',
                attributes: [
                    'username',
                    'icon',
                ],
            },
        ],
        limit: 10,
    });

    res.render('latest', {
        title: '最新內容',
        images
    });
});

app.get('/tag/:id', sidebarData, async (req, res) => {
    const tag = await Tag.findOne({
        where: {
            tagId: req.params.id,
        },
    });
    const images = await Image.findAll({
        attributes: [
            'imageId',
            'content',
            'category',
            'likes',
        ],
        include: [
            {
                model: Tag,
                as: 'tags',
                where: {
                    tagId: req.params.id,
                }
            },
            {
                model: User,
                as: 'author',
                attributes: [
                    'username',
                    'icon',
                ],
            },
        ],
    });
    res.render('tag', {
        title: tag.tag,
        tag,
        images
    });
});

app.get('/image/:id', sidebarData, (req, res) => {
    Image.findOne({
        where: {
            imageId: req.params.id,
        },
        attributes: [
            'content',
            'description',
            'likes',
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
                    'followerCount',
                ],
            },
            {
                model: Comment,
                as: 'comments',
                attributes: [
                    'comment',
                    'createdAt'
                ],
                include: {
                    model: User,
                    as: 'author',
                    attributes: [
                        'userId',
                        'username',
                        'icon',
                    ],
                },
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
            title: '圖片',
            image
        });
    })
    .catch(error => {
        res.status(500).send({ error });
    });
});

app.get('/profile/:id', sidebarData, async (req, res) => {
    // await User.findAll({
    //     attributes: [
    //         'userId',
    //         'username',
    //         'icon',
    //         'followerCount',
    //     ],
    //     include: [{
    //         model: User,
    //         as: 'following',
    //         where: {
    //             userId: req.session.user.id,
    //         },
    //     }],
    // });

    User.findOne({
        where: {
            userId: req.params.id
        },
        attributes: [
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
    .catch(error => {
        res.status(500).send({ error });
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
        const tagIds = await Promise.all(req.body.tags.map(tag => Tag.findOrCreate({
            where: {
                tag,
            }
        })))
        .then(res => res.map(data => data[0].tagId));
        Image.create({
            content: req.file.buffer,
            category: req.body.category,
            userId: req.session.user.id,
            description: req.body.description,
        })
        .then(async record => {
            await Promise.all(tagIds.map(tagId =>
                ImageTag.create({
                    imageId: record.imageId,
                    tagId,
                })
            ));
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

// TODO: handle button events
app.get('/like', authenticate, async(req, res) => {
});

app.get('/follow/user', authenticate, async(req, res) => {
});

app.get('/follow/tag', authenticate, async(req, res) => {
});

app.get('/comment', authenticate, async (req, res) => {
    console.log(req.query)
    const comment = await Comment.create({
        imageId: req.query.imageId,
        userId: req.session.user.id,
        comment: req.query.comment,
    });
    const author = await User.findOne({
        where: {
            userId: req.session.user.id,
        },
        attributes: [
            'username',
            'icon'
        ],
    });
    console.log(comment)
    res.send(JSON.stringify({
        comment,
        author,
    }));
});

app.use(function(req, res, next) {
    res.status(404).render('error', {
        title: '查無內容',
    });
});

app.listen(config.port, () => {
    console.log(`Listen on ${ config.port }`);
});
