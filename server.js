// --- Импорты --- //
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');
const sequelize = require('./config/database');
const path = require('path');

// --- Настройка приложения --- //
const app = express();

// --- Middleware (Промежуточное ПО) --- //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- GraphQL Endpint --- //
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

// --- Маршруты --- //
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// --- Запуск сервера --- //
const PORT = process.env.PORT || 3000;

sequelize.sync()
    .then(() => {
        console.log('База данных подключена и синхронизирована.');
        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}. Откройте http://localhost:${PORT}`);
            console.log(`GraphiQL доступен по адресу http://localhost:${PORT}/graphql`);
        });
    })
    .catch(err => {
        console.error('Ошибка подключения к базе данных:', err);
    });