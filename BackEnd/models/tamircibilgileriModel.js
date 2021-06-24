const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TamiriciBilgileriSchema = new Schema({
    /* _id: {
         type: mongoose.Types.ObjectId,
         unique: true
     },*/
    isim: {
        type: String,
        required: true
    },
    soyisim: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isyeriadi: {
        type: String,
        required: true
    },
    sehir: {
        type: String,
        required: true
    },
    kategori: [],
    adres: {
        type: String,
        maxlength: [250, 'en fazla 250 karakter girilebilir'],
        required: true
    },
    aciklama: {
        type: String,
        maxlength: [250, 'en fazla 250 karakter girilebilir'],
        required: true
    },
    sifre: {
        type: String,
        required: true
    },
    calismasaatleri: {
        type: String,
        required: true
    },
    olusturulmatarihi: {
        type: Date,
        default: Date.now
    },
    durum: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        required: true
    }
}, { collection: 'Tamirci' })

module.exports = mongoose.model('tamirci', TamiriciBilgileriSchema);