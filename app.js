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

app.listen(port);
console.log(`Listen on ${ port }`);