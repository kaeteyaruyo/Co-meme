const Sequelize = require('sequelize');
const database = require('./connect');

module.exports = database.define('follower', {
    userId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'user',
            key: 'userId'
        }
    },
    followerId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'user',
            key: 'userId'
        }
    }
}, {
    tableName: 'follower',
    freezeTableName: true,
    timestamps: false
});
