const kullanicibilgileriRouter=require('express').Router()
const kullanicibilgileriController=require('../controllers/kullanicibilgileriController')

kullanicibilgileriRouter.post('/kullaniciEkle',kullanicibilgileriController.kullaniciEkle)
kullanicibilgileriRouter.get('/kullaniciBilgileri/:id',kullanicibilgileriController.kullaniciBilgileri)
kullanicibilgileriRouter.post('/kullaniciGuncelle',kullanicibilgileriController.kullaniciGuncelle)
//kullanicibilgileriRouter.post('/kullaniciGiris',kullanicibilgileriController.kullaniciGiris)


//kullanicibilgileriRouter.get('/userListOne/:id',kullanicibilgileriController.kullaniciListOne)
//kullanicibilgileriRouter.post('/userLogin',kullanicibilgileriController.kullaniciLogin)

module.exports=kullanicibilgileriRouter;