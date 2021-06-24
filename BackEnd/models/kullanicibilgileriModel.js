const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const KullaniciBilgileriSchema=new Schema({
    isim:{
        type: String,
        required:true
    },
    soyisim:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
    },
    sifre:{
        type: String,
        required:true
    },
    sehir:{
        type: String,
        required:true
    },
    olusturulmatarihi:{
        type: Date,
        default:Date.now
    },
    durum:{
        type: Boolean,
        default:false
    },
    role:{
        type: String,
        required:true
    }
    
},{collection:'Kullanici'})

module.exports=mongoose.model('kullanici',KullaniciBilgileriSchema);