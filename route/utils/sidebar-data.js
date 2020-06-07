const { Tag } = require('../../models/association.js');

module.exports = async function (req, res, next){
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
