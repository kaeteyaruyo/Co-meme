const Sequelize = require('sequelize');
const database = require('./connect');

module.exports = database.define('tag', {
    tagId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    tag: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
}, {
    tableName: 'tag',
    freezeTableName: true,
    timestamps: false
});
