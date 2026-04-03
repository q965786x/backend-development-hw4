const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('./middlewares/cors');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const loggerOne = require('./middlewares/loggerOne');
const loggerTwo = require('./middlewares/loggerTwo');

dotenv.config();

const {
    PORT = 3000,
    API_URL = 'http://127.0.0.1',
    MONGO_URL = "mongodb://127.0.0.1:27017/backend-hw4"  // ← заменил на локальную БД
} = process.env;

const app = express();

app.use(cors);
app.use(loggerOne);
app.use(bodyParser.json());

const helloWorld = (request, response) => {
    response.status(200);
    response.send('Hello, World!');
}

app.get('/', helloWorld);

app.post('/', (request, response) => {
    response.status(200);
    response.send('Hello from POST');
});

app.use(userRouter);

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`🚀 Сервер запущен по адресу ${API_URL}:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        // Сервер всё равно запустится, даже если БД не подключилась
        app.listen(PORT, () => {
            console.log(`⚠️ Сервер запущен по адресу ${API_URL}:${PORT} (без БД)`);
        });
    });