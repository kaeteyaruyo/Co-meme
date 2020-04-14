const express = require('express');
const parser = require('body-parser');
const path = require('path');
const app = express();
const port = 8888;
const root = process.cwd();

app.use(express.static(path.join(root, '/static')));
app.use(parser.urlencoded( { extended: true } ));
app.use(parser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(root, 'static/html/index.html'));
});

app.get('/login', (req,res) => {
    res.sendFile(path.join(root, 'static/html/login.html'));
})

app.get('/login/submit', (req,res) => {
    // get account & password
    account = req.query.account;
    password = req.query.password;
    // respond 
    res.send('login!');
})
app.listen(port);
console.log(`Listen on ${ port }`);