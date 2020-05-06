const Sequelize = require('sequelize');
const conncetion = require('./connect.js');

const User = conncetion.define('user', {
    username: {
        type:      Sequelize.STRING( 20 ),
        allowNull: true,
    },
    email: {
        type:       Sequelize.STRING( 300 ),
        allowNull:  false,
        primaryKey: true,
        unique:     true,
    },
    password: {
        type:      Sequelize.STRING( 60 ),
        allowNull: true,
    },
    birthday: {
        type:         Sequelize.DATE,
        allowNull:    false,
    },
} );

module.exports = User;