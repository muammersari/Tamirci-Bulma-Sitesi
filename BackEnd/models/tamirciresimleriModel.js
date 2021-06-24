const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ResimlerSchema = new Schema({

    tamirciid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    durum: {
        type: String,
        required: true
    },
    resimler: {
        data: Buffer,
        contentType: String
    }
}, { collection: 'Resimler' })

module.exports = mongoose.model('resimler', ResimlerSchema);