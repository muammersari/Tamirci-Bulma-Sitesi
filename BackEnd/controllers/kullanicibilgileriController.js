const kullanici = require('../models/kullanicibilgileriModel')

//bu metod yeni bir kullanıcı oluşturur.
const kullaniciEkle = async (req, res) => {
    try {

        var mailadresivarmi = await kullanici.find({ email: req.body.email });//girilen mail adresi daha önce kullanılıp kullanılmadığını tespit etmek için.
        if (mailadresivarmi.length > 0) {
            return res.status(205).json({ msg: "Bu Mail Adresi Kullanılıyor!" })
        }
        else {//girilen değerler uygun ise kullanıcıyı kayıt eder.
            delete req.body._id
            const newUser = new kullanici(req.body)
            const post = await newUser.save()
            if (post) return res.status(200).json(post)
            else return res.status(400).json({ msg: "Kayıt Oluşturulamadı!" })
        }


        /*  delete req.body._id
          const newUser = new kullanici(req.body)
          const post = await newUser.save()
          if (post) { console.log(post); return res.status(200).json(post) }
          else return res.status(400).json({ msg: "Kayıt Oluşturulamadı!" })*/

    }
    catch (err) { return res.status(404).json({ err }) }
}
//bu metod id değeri parametre olarak gönderilen kullanıcının bilgilerini geri gönderir.
const kullaniciBilgileri = async (req, res) => {
    try {
        const gelenkullanici = await kullanici.findById({ _id: req.params.id })//ilgili kullanıcının bütün bilgileri listelendi.
        if (gelenkullanici) {
            return res.status(200).json(gelenkullanici)
        }
        else
            return res.status(400).json({ "msg": "Kullanıcı Bulunamadı!" })
    }
    catch (err) { return res.status(404).json({ "msg": err }) }
}

//bu metod body kısmında gönderilen kullanici şifresini günceller.
const kullaniciGuncelle = async (req, res) => {
    try {
        const kullanici_bilgileri = await kullanici.findById({ _id: req.body._id })
        if (kullanici_bilgileri) {//gönderilen id kontol ediliyor.
            const post = await kullanici.findByIdAndUpdate({ _id: req.body._id }, { sifre: req.body.sifre/*,durum: true*/ }, { new: true })
            if (post) return res.status(200).json(post)
        }
        else return res.status(400).json({ msg: 'Kullanıcı Bulunamadı!' })
    }
    catch (err) {
        return res.status(404).json({ err })
    }

}

//bu metod kullanıcının oturum açması için kullanılır.
//const kullaniciGiris=async(req,res)=>{
//   try{
//       const post=await kullanici.find({email:req.body.email,sifre:req.body.sifre})
//       if(post.length>0)
//     return res.status(200).json(post);
//     else
//      return res.status(400).json({msg:false});
// }
//   catch(err){return res.status(404).json({"msg":err})}
//}

module.exports = {
    kullaniciEkle,
    kullaniciBilgileri,
    kullaniciGuncelle,

}