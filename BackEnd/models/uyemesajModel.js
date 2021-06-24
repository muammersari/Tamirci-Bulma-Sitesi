const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UyeMesajSchema = new Schema({
    kullaniciid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    tamirciid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    kullanicidelete: {//kullanici mesajısildi ise true olacak
        type: Boolean,
        default:false
    },
    tamircidelete: {//tamirci mesajı sildi ise true olacak
        type: Boolean,
        default:false
    },
    kullanici_goruntulenmeyen_mesaj_sayisi: {
        type: String,
        default: "0"
    },
    tamirci_goruntulenmeyen_mesaj_sayisi: {
        type: String,
        default: "0"
    },
}, { collection: 'UyeMesaj' })

module.exports = mongoose.model('uyemesaj', UyeMesajSchema);