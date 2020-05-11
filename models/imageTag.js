const Sequelize = require('sequelize');
const database = require('./connect');

module.exports = database.define('imageTag', {
    imageId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'image',
            key: 'imageId'
        }
    },
    tagId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'tag',
            key: 'tagId'
        }
    }
}, {
    tableName: 'imageTag',
    freezeTableName: true,
    timestamps: false
});
