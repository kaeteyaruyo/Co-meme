const Sequelize = require('sequelize');
const database = require('./connect');

module.exports = database.define('user', {
    userId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
    },
    email: {
        type: Sequelize.STRING(300),
        allowNull: false,
    },
    birthday: {
        type: Sequelize.DATEONLY,
    },
    icon: {
        type: "MEDIUMBLOB",
        get() {
            return Buffer.from(this.getDataValue('content') || '').toString('base64');
        }
    },
    host: {
        type:   Sequelize.ENUM,
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
