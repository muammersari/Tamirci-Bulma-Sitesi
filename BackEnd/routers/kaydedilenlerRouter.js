const kaydedilenlerRouter=require('express').Router()
const kaydedilenlerController=require('../controllers/kaydedilenlerController')

kaydedilenlerRouter.post('/tamirciKaydet',kaydedilenlerController.tamirciKaydet)
kaydedilenlerRouter.get('/kayitliTamirciler/:id',kaydedilenlerController.kayitliTamirciler)
kaydedilenlerRouter.get('/kayitlitamircisil/:id',kaydedilenlerController.kayitlitamircisil)



module.exports=kaydedilenlerRouter;