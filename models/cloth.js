const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cloth = sequelize.define('Cloth', {
    // Название игрушки
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Описание игрушки
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    // Цена игрушки
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    // Категория игрушки
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Путь к изображению игрушки
    image: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Cloth;