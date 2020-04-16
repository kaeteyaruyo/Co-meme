const express = require('express');
const parser = require('body-parser');
const path = require('path');
const app = express();
const port = 8888;
const root = process.cwd();
const db = {};

app.use(express.static(path.join(root, '/static')));
app.use(parser.urlencoded( { extended: true } ));
app.use(parser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(root, 'static/html/index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(root, 'static/html/signup.html'));
})

app.post('/signup', (req, res) => {
    db[req.body.account] = req.body.password;
    res.redirect('/signin');
})

app.get('/signin', (req, res) => {
    res.sendFile(path.join(root, 'static/html/signin.html'));
})

app.post('/signin', (req, res) => {
    if(db[req.body.account] && db[req.body.account] === req.body.password){
        res.redirect(`/user/${ req.body.account }`);
    }
    res.redirect('signin');
})

app.get('/user/:account', (req, res) => {
    res.sendFile(path.join(root, 'static/html/user.html'));
});

app.listen(port, () => {
    console.log(`Listen on ${ port }`);
});
