const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
app.use(express.json());
app.use(cors());
//MongoDb Bağlantı
require('./db/dbConnection')

//routerlar

const kullanicibilgileriRouter = require('./routers/kullanicibilgileriRouter');
const tamircibilgileriRouter = require('./routers/tamircibilgileriRouter');
const loginRouter = require('./routers/loginRouter');
const mesajlarRouter = require('./routers/mesajlarRouter');
const kaydedilenlerRouter = require('./routers/kaydedilenlerRouter');


//sayfa yönlendirme

app.use('/api/kullanici', kullanicibilgileriRouter);
app.use('/api/tamirci', tamircibilgileriRouter);
app.use('/api/login', loginRouter);
app.use('/api/mesajlar', mesajlarRouter);
app.use('/api/kaydedilenler', kaydedilenlerRouter);



app.listen(3000, () => {
    console.log("3000 Portundan Server dinleniyor.");
});