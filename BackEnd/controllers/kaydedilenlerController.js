const { json } = require('body-parser')
const kaydedilenler = require('../models/kaydedilenlerModel')
const tamirci = require('../models/tamircibilgileriModel')


const tamirciKaydet = async (req, res) => {
    try {
        var kaydedilmismi = await kaydedilenler.find({ kullaniciid: req.body[0], tamirciid: req.body[1] });//tamircinin daha önce kayıt edilip edilmediği kontrol ediliyor
        if (kaydedilmismi.length > 0) {
            return res.status(205).json({ msg: "Bu Tamirci Zaten Ekli!" })
        }
        else {
            var tamircikayit = { kullaniciid: req.body[0], tamirciid: req.body[1] };
            const newUser = new kaydedilenler(tamircikayit)
            const post = await newUser.save()
            if (post) return res.status(200).json(post)
            else return res.status(400).json({ msg: "Kayıt Oluşturulamadı!" })
        }
    }
    catch (err) { return res.status(404).json({ err }) }
}

const kayitliTamirciler = async (req, res) => {
    try {
        var kayitlitamirciler = await kaydedilenler.find({ kullaniciid: req.params.id });
        if (kayitlitamirciler) {
            var list_kayitlitamirci = [];
            for (let i = 0; i < kayitlitamirciler.length; i++) {
                var tamirciisim = await tamirci.findOne({ _id: kayitlitamirciler[i].tamirciid });
                list_kayitlitamirci.push({
                    _id: kayitlitamirciler[i]._id,
                    kullaniciid: kayitlitamirciler[i].kullaniciid,
                    tamirciid: kayitlitamirciler[i].tamirciid,
                    isyeriadi: tamirciisim.isyeriadi
                });
            }
            return res.status(200).json(list_kayitlitamirci)
        } else {
            return res.status(400).json({ "msg": "Kayitli Tamirci Bulunamadı!" })
        }
    }
    catch (err) { return res.status(404).json({ err }) }


}

const kayitlitamircisil = async (req, res) => {
    try {
        var obj = await kaydedilenler.find({ _id: req.params.id });
        if (obj.length > 0) {
            await kaydedilenler.findByIdAndDelete({ _id: req.params.id });
            return res.json(200);
        } else { return res.json(400); }

    }
    catch (err) { return res.status(404).json({ err }) }
}

module.exports = {
    tamirciKaydet,
    kayitliTamirciler,
    kayitlitamircisil
}