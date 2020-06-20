const bodyParser = require('body-parser');

const urlEncoded = bodyParser.urlencoded({
    extended: true,
    limit:    '5GB',
});

const jsonParser = bodyParser.json({
    limit: '5GB',
    type:  '*/json',
});

module.exports = {
    urlEncoded,
    jsonParser,
};
