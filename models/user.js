const Sequelize = require('sequelize');
const database = require('./connect');

module.exports = database.define('user', {
    userId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING(300),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.CHAR(60),
        allowNull: false
    },
    birthday: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    followerCount: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        defaultValue: '0'
    }
}, {
    tableName: 'user',
    freezeTableName: true,
    timestamps: false
});
