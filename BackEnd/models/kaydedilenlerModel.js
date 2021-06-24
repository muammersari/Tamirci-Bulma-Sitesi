const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const KaydedilenlerSchema=new Schema({
    kullaniciid:{
        type: String,
        required:true
    },
    tamirciid:{
        type: String,
        required:true
    }
},{collection:'Kaydedilenler'})

module.exports=mongoose.model('kaydedilenler',KaydedilenlerSchema);