const mesajlarRouter = require('express').Router()
const mesajlarController = require('../controllers/mesajlarController')

mesajlarRouter.post('/mesajEkle', mesajlarController.mesajEkle)
mesajlarRouter.post('/mesajGetir', mesajlarController.mesajGetir)
mesajlarRouter.post('/MesajicerigiGetir/:role', mesajlarController.MesajicerigiGetir)
mesajlarRouter.post('/MesajSil/:role', mesajlarController.MesajSil)


module.exports = mesajlarRouter;
