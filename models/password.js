const Sequelize = require('sequelize');
const database = require('./connect');

module.exports = database.define('password', {
    userId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'user',
            key: 'userId',
        }
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
}, {
    tableName: 'password',
    freezeTableName: true,
    timestamps: false
});
