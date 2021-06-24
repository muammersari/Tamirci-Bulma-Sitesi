const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MesajlarSchema = new Schema({
    kullaniciid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    tamirciid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    mesajatan: {
        type: String,
        required: true
    },
    mesaj: {
        type: String,
        required: true
    },
    kullanicidelete: {//kullanici mesajısildi ise true olacak
        type: Boolean,
        default: false
    },
    tamircidelete: {//tamirci mesajı sildi ise true olacak
        type: Boolean,
        default: false
    },
    tarih: {
        type: Date,
        default: Date.now
    }
}, { collection: 'Mesajlar' })

module.exports = mongoose.model('mesajlar', MesajlarSchema);