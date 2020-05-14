const Sequelize = require('sequelize');
const database = require('./connect');

module.exports = database.define('comment', {
    commentId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    comment: {
        type: Sequelize.STRING(500),
        allowNull: false
    },
    imageId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
    },
    userId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
    },
}, {
    tableName: 'comment',
    freezeTableName: true,
    timestamps: true,
    updatedAt: false,
});
