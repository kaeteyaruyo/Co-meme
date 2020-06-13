const Sequelize = require('sequelize');
const database = require('./connect');
const relativeDate = require('relative-date');

module.exports = database.define('likeImage', {
    userId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'user',
            key: 'userId'
        }
    },
    imageId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'image',
            key: 'imageId'
        }
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        get() {
            return relativeDate(this.getDataValue('createdAt'));
        }
    },
}, {
    tableName: 'likeImage',
    freezeTableName: true,
    timestamps: false,
});
