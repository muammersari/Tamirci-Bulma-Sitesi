const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/TamirciBulDb',{
    useCreateIndex: true, 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false
})
.then(() => console.log("Veri Tabanına bağlanıldı"))
.catch(hata => console.log("Veri Tabanı bağlantı hatası"));