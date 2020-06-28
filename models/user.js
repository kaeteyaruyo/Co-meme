const Sequelize = require('sequelize');
const database = require('./connect');

module.exports = database.define('user', {
    userId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
    },
    username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
    },
    email: {
        type: Sequelize.STRING(300),
        primaryKey: true,
        allowNull: false,
    },
    birthday: {
        type: Sequelize.DATEONLY,
    },
    host: {
        type:   Sequelize.ENUM,
        primaryKey: true,
        allowNull: false,
        values: ['local', 'google', 'facebook', 'twitter', 'instagram']
    },
    hash: {
        type: Sequelize.CHAR(20),
        unique: true,
    },
}, {
    tableName: 'user',
    freezeTableName: true,
    timestamps: false
});
