const Sequelize = require('sequelize');
const database = require('./connect');

module.exports = database.define('tagFollower', {
    userId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'user',
            key: 'userId'
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
    tableName: 'tagFollower',
    freezeTableName: true,
    timestamps: false
});
