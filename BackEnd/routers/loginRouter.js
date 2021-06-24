const loginRouter=require('express').Router()
const loginController=require('../controllers/loginController')

loginRouter.post('/kullaniciGiris',loginController.kullaniciGiris)

module.exports=loginRouter;


