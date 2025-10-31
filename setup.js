// Этот скрипт предназначен для первоначального заполнения базы данных тестовыми данными.

const Cloth = require('./models/cloth');
const sequelize = require('./config/database');

const sampleClothes = [
    {
        name: 'Urban Flow Hoodie',
        description: 'Stay effortlessly cool with the Urban Flow Hoodie — made from ultra-soft cotton blend with a relaxed fit. Minimal logo embroidery on the chest and a hidden pocket for your essentials. Perfect for city walks or cozy weekends.',
        price: 59.00,
        category: 'Hoodies & Sweatshirts',
        image: '/img/hoodie.jpg'
    },
    {
        name: 'CloudBase Tee',
        description: 'A lightweight, premium cotton T-shirt designed for everyday wear. The CloudBase Tee features a clean silhouette, soft-touch fabric, and subtle stitching detail for a timeless minimalist look.',
        price: 32.00,
        category: 'T-Shirts',
        image: '/img/tee.jpg'
    },
    {
        name: 'Echo Denim',
        description: 'The Echo Denim jeans combine comfort and structure with a mid-rise, straight-leg cut. Crafted from durable organic denim with a slightly washed finish — made to move with you and last for years.',
        price: 79.00,
        category: 'Jeans',
        image: '/img/echo.jpg'
    },
    {
        name: 'Midnight Layer Jacket',
        description: 'Sleek, lightweight, and weather-ready. The Midnight Layer Jacket features a water-resistant outer shell and a breathable inner lining. Designed for layering — from office mornings to late-night strolls.',
        price: 110.00,
        category: 'Jackets',
        image: '/img/jacket.jpg'
    }
];

// Функция для синхронизации базы данных и заполенния данными
const setupDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('База данных и таблицы успешно созданы!');

        await Cloth.bulkCreate(sampleClothes);
        console.log('Тестовые данные успешно загружены!');

    } catch (error) {
        console.error('Ошибка при настройке базы данных:', error);
    } finally {
        await sequelize.close();
        console.log('Соединение с базой данных закрыто.');
    }
};

setupDatabase();