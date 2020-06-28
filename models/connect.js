const Sequelize = require('sequelize');
const config = require('../config.js');

module.exports = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    {
        host:    config.db.host,
        port:    config.db.port,
        dialect: 'mysql',
        // logging: false,
        define: {
            freezeTableName: true,
            timestamps: false,
        },
        pool: {
            max: 100,
            min: 0,
            idle: 20000,
            acquire: 20000,
        },
        timezone: '+08:00', // for writing to database
    }
);
