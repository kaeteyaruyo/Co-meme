const path = require('path');
const bcrypt = require('bcrypt');
const express = require('express');
const parser = require('body-parser');

const config = require('./config.js');
const User = require('./models/user.js');

const app = express();
const root = process.cwd();

app.set('view engine', 'pug');
app.set('views', path.join(root, '/static/pug'));
app.use(express.static(path.join(root, '/static')));
app.use(parser.urlencoded( { extended: true } ));
app.use(parser.json());

app.get('/', (req, res) => {
    res.render('index', {
        title: '首頁',
    });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/image', (req, res) => {
    res.render('image', {
        title: '圖片',
    });
});

app.get('/profile/:user', (req, res) => {
    res.render('profile', {
        title: `${ req.params.user }的頁面`,
    });
});

app.get('/signup', (req, res) => {
    res.render('signup', {
        title: '會員註冊',
    });
});

app.post('/signup', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        birthday: `${ req.body.birthyear }-${ req.body.birthmonth }-${ req.body.birthdate }`,
    })
    .then(() => {
        res.redirect('/signin');
    })
    .catch(err => {
        if(err.errors[0].message === 'PRIMARY must be unique'){
            // TODO: frontend error message display
            res.redirect('/signup');
        }
        else{
            res.status(500).send('Server side error occured');
        }
    });
});

app.get('/signin', (req, res) => {
    res.render('signin', {
        title: '會員登入',
    });
});

app.post('/signin', async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        },
        attributes: ['username', 'password'],
    });
    bcrypt.compare(req.body.password, user.password)
    .then(matched => {
        if(matched){
            res.redirect(`/profile/${ user.username }`);
        }
        else {
            // TODO: frontend error message display
            res.redirect('signin');
        }
    });
});

app.listen(config.port, () => {
    console.log(`Listen on ${ config.port }`);
});
