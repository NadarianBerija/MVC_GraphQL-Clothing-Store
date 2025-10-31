const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('wearly', 'root', '', {
    host: 'localhost',
    dialect: 'mysql' 
});

module.exports = sequelize;