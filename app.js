const express = require('express');
const path = require('path');

const app = express();
const root = process.cwd();
app.set('view engine', 'pug');
app.set('views', path.join(root, 'static/pug'));
app.use(express.static(path.join(root,'/static')));

app.get('/', (req, res) => {
    res.render('section', {
        title: 'section',
    });
});
app.get('/upload', (req, res) => {
    res.render('upload', {
        title: 'section',
    });
});

app.listen( 8888, () => {
    console.log('listen on 8888');
});
