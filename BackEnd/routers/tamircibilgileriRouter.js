const tamircibilgileriRouter = require('express').Router()
const tamircibilgileriController = require('../controllers/tamircibilgileriController')

tamircibilgileriRouter.post('/tamirciEkle', tamircibilgileriController.tamirciEkle)
tamircibilgileriRouter.get('/tamirciBilgileri/:id', tamircibilgileriController.tamirciBilgileri)
tamircibilgileriRouter.get('/tamirciresimbilgileri/:id', tamircibilgileriController.tamirciresimbilgileri)
tamircibilgileriRouter.post('/tamirciList', tamircibilgileriController.tamirciList)
tamircibilgileriRouter.post('/tamircisifreGuncelle', tamircibilgileriController.tamircisifreGuncelle)
tamircibilgileriRouter.post('/resimEkle', tamircibilgileriController.resimEkle)
tamircibilgileriRouter.get('/resimGetir/:id', tamircibilgileriController.resimGetir)
tamircibilgileriRouter.get('/resimdurumuguncelle/:resimid/:tamirciid', tamircibilgileriController.resimdurumuguncelle)
tamircibilgileriRouter.get('/resimsil/:resimid/:tamirciid', tamircibilgileriController.resimsil)
tamircibilgileriRouter.post('/tamircibilgileriniguncelle/:id', tamircibilgileriController.tamircibilgileriniguncelle)


//kullanicibilgileriRouter.get('/userListOne/:id',kullanicibilgileriController.kullaniciListOne)
//kullanicibilgileriRouter.post('/userLogin',kullanicibilgileriController.kullaniciLogin)

module.exports = tamircibilgileriRouter;