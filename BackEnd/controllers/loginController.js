const kullanici = require('../models/kullanicibilgileriModel')
const tamirci = require('../models/tamircibilgileriModel')

//bu metod kullanıcının oturum açması için kullanılır.
const kullaniciGiris = async (req, res) => {
    try {
        const post = await kullanici.find({ email: req.body.email, sifre: req.body.sifre },"_id isim email sifre role");
        if (post.length > 0) {
            return res.status(200).json(post)
        }
        else {
            const post1 = await tamirci.find({ email: req.body.email, sifre: req.body.sifre });
            if (post1.length > 0) {
                delete post1.isim
                delete post1.soyisim
                delete post1.isyeriadi
                delete post1.adres
                delete post1.aciklama
                delete post1.calismasaatleri
                delete post1.olusturulmatarihi
                delete post1.durum
                return res.status(200).json(post1);
            }
            else {
                console.log("hata 400");
                return res.status(400).json({ msg: false });
            }
        }
    }
    catch (err) {console.log("hata err"); return res.status(404).json({ "msg": err }) }
}

module.exports = {
    kullaniciGiris
}
