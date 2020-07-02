const Sequelize = require('sequelize');
const database = require('./connect');

module.exports = database.define('template', {
    templateId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    content: {
        type: "MEDIUMBLOB",
        allowNull: false,
        get() {
            return Buffer.from(this.getDataValue('content')).toString('base64');
        },
    },
    category: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
    },
    title: {
        type: Sequelize.STRING(80),
        allowNull: true,
    },
    description: {
        type: Sequelize.STRING(500),
        allowNull: true,
        defaultValue: ''
    },
    userId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
    },
    usedCount: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        defaultValue: '0'
    },
}, {
    tableName: 'template',
    freezeTableName: true,
    timestamps: false
});
