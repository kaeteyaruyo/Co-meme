const Sequelize = require('sequelize');
const database = require('./connect');

module.exports = database.define('text', {
    textId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    templateId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
    },
    top: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
    },
    left: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
    },
    fontSize: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
    },
    fill: {
        type: Sequelize.CHAR(7),
        allowNull: false
    },
}, {
    tableName: 'text',
    freezeTableName: true,
    timestamps: false,
});
