const express = require('express');
const parser = require('body-parser');
const path = require('path');
const app = express();
const port = 8888;
const root = process.cwd();
const db = {};

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

app.get('/upload', (req, res) => {
    res.render('upload', {
        title: '上傳',
    });
});

app.get('/profile/:user', (req, res) => {
    res.render('profile', {
        title: `${ req.params.user }的頁面`,
    });
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    db[req.body.account] = req.body.password;
    res.redirect('/signin');
});

app.get('/signin', (req, res) => {
    res.render('signin');
});

app.post('/signin', (req, res) => {
    if(db[req.body.account] && db[req.body.account] === req.body.password){
        res.redirect(`/user/${ req.body.account }`);
    }
    else {
        res.redirect('signin');
    }
});

app.listen(port, () => {
    console.log(`Listen on ${ port }`);
});
