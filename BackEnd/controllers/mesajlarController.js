const mesaj = require('../models/mesajlarModel')
const tamirci = require('../models/tamircibilgileriModel')
const kullanici = require('../models/kullanicibilgileriModel')
const uyemesaj = require('../models/uyemesajModel')



//bu metod mesaj ekler
const mesajEkle = async (req, res) => {
    try {
        delete req.body.tarih
        const yenimesaj = new mesaj(req.body)
        const post = await yenimesaj.save()

        const uyemesajvarmi = await uyemesaj.find({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid });
        if (uyemesajvarmi.length > 0) { //burada uyemesaj tablosunda bilgiler var ise sadece delete alanlarını false yapıyoruz
            var mesajsayisi_kullanici = 0;
            var mesajsayisi_tamirci = 0;

            if (req.body.mesajatan.toString() == "kullanici") {
                if (req.body.mesajgoruldumu == "hayir") {
                    mesajsayisi_tamirci = parseInt(uyemesajvarmi[0].tamirci_goruntulenmeyen_mesaj_sayisi) + 1;
                } else {
                    mesajsayisi_kullanici = 0;
                    mesajsayisi_tamirci = 0;
                }
                await uyemesaj.updateOne({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid }, { tamircidelete: false, kullanicidelete: false, tamirci_goruntulenmeyen_mesaj_sayisi: mesajsayisi_tamirci.toString(), kullanici_goruntulenmeyen_mesaj_sayisi: mesajsayisi_kullanici.toString() }, { new: true });
            } else {
                if (req.body.mesajgoruldumu == "hayir") {
                    mesajsayisi_kullanici = parseInt(uyemesajvarmi[0].kullanici_goruntulenmeyen_mesaj_sayisi) + 1;
                } else {
                    mesajsayisi_kullanici = 0;
                    mesajsayisi_tamirci = 0;
                }
                await uyemesaj.updateOne({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid }, { tamircidelete: false, kullanicidelete: false, kullanici_goruntulenmeyen_mesaj_sayisi: mesajsayisi_kullanici.toString(), tamirci_goruntulenmeyen_mesaj_sayisi: mesajsayisi_tamirci.toString() }, { new: true });
            }
        } else {//burada uyemesaj tablosunda bilgiler yok ise kayıt yapıyoruz
            delete req.body.mesajatan
            delete req.body.mesaj
            delete req.body.isyeriadi
            delete req.body.mesajgoruldumu
            const newuyemesaj = new uyemesaj(req.body)
            await newuyemesaj.save()
        }

        if (post) return res.status(200).json(post)
        else return res.status(400).json({ msg: "Mesaj Eklenemedi!" })
    }
    catch (err) { return res.status(404).json({ err }) }
}

//bu metod id si verilen kullanıcının mesajlarını getirir
const mesajGetir = async (req, res) => {
    try {
        var obje = [];
        if (req.body[0] == "kullanici") { //gelen role kullanici ise kullanicinin mesajları alınıyor.
            var mesajlar1 = await uyemesaj.find({ kullaniciid: req.body[1], kullanicidelete: false }); //req.body[1] gelen kullanicinin id sini tutuyor ve kullanicinın silmediği mesajlar yani false olanlar alınıyor
            if (mesajlar1.length > 0) { // kullanıcı mesajları silmedi ise uyemesaj tablosundan bilgiler alınıyor
                for (let i = 0; i < mesajlar1.length; i++) {
                    var _isyeriadi = await tamirci.findOne({ _id: mesajlar1[i].tamirciid }, "isyeriadi");// burada kullanıcının mesajlaştığı tamircinin işyeri ismi alınıyor

                    obje.push({
                        kullaniciid: mesajlar1[i].kullaniciid,
                        tamirciid: mesajlar1[i].tamirciid,
                        karsi_taraf_isim: _isyeriadi.isyeriadi,
                        kullanici_goruntulenmeyen_mesaj_sayisi: mesajlar1[i].kullanici_goruntulenmeyen_mesaj_sayisi,
                        tamirci_goruntulenmeyen_mesaj_sayisi: mesajlar1[i].tamirci_goruntulenmeyen_mesaj_sayisi
                    });
                }
            }

        } else { //gelen role tamirci ise tamircinin mesajları alınıyor.
            var mesajlar2 = await uyemesaj.find({ tamirciid: req.body[1], tamircidelete: false });//req.body[1] gelen tamircinin id sini tutuyor ve tamircinin silmediği mesajlar yani false olanlar alınıyor
            if (mesajlar2.length > 0) { // tamirci mesajları silmedi ise uye mesaj tablosundan bilgileralınıyor
                for (let j = 0; j < mesajlar2.length; j++) {
                    var isimsoyisim = await kullanici.findOne({ _id: mesajlar2[j].kullaniciid }, "isim soyisim"); //burada tamircinin mesajlaştığı kullanıcının ism ve soyismi alınıyor
                    obje.push({
                        kullaniciid: mesajlar2[j].kullaniciid,
                        tamirciid: mesajlar2[j].tamirciid,
                        karsi_taraf_isim: isimsoyisim.isim + " " + isimsoyisim.soyisim,
                        kullanici_goruntulenmeyen_mesaj_sayisi: mesajlar2[j].kullanici_goruntulenmeyen_mesaj_sayisi,
                        tamirci_goruntulenmeyen_mesaj_sayisi: mesajlar2[j].tamirci_goruntulenmeyen_mesaj_sayisi
                    });
                }
            }
        }

        return res.status(200).json(obje);
        /* if (mesajlar.length > 0) { 
             for (var i = 0; i < mesajlar.length; i++) {
                 var varmi = "yok";
                 for (var j = 0; j < obje.length; j++) {
                     if (req.body[0] == "kullanici") {
                         if (mesajlar[i].tamirciid.toString() == obje[j].tamirciid.toString()) {
                             varmi = "var";
                         }
                     } else {
                         if (mesajlar[i].kullaniciid.toString() == obje[j].kullaniciid.toString()) {
                             varmi = "var";
                         }
                     }
                 }
                 if (varmi == "yok") {
                     var _isyeriadi;
                     if (req.body[0] == "kullanici") {
                         _isyeriadi = await tamirci.findOne({ _id: mesajlar[i].tamirciid }, "isyeriadi");
                         _isyeriadi = _isyeriadi.isyeriadi;
 
                     } else {
                         _isyeriadi = await kullanici.findOne({ _id: mesajlar[i].kullaniciid }, "isim soyisim");
                         _isyeriadi = _isyeriadi.isim + " " + _isyeriadi.soyisim;
                     }
                     obje.push({
                         kullaniciid: mesajlar[i].kullaniciid,
                         tamirciid: mesajlar[i].tamirciid,
                         mesajatan: mesajlar[i].mesajatan,
                         mesaj: mesajlar[i].mesaj,
                         tarih: mesajlar[i].tarih,
                         isyeriadi: _isyeriadi
                     });
                 }
             }
             return res.status(200).json(obje);
         } else { return res.status(400).json("kullanici mesajlari bulunamadi"); }*/
    }
    catch (err) { return res.status(404).json({ err }) }
}
const MesajicerigiGetir = async (req, res) => { //burada id si gönderilen kişinin mesajlaştığı kişi ile olan konuşmalarının içeriği getiriliyor
    try {
        var mesajicerigi;
        if (req.params.role == "kullanici") {
            mesajicerigi = await mesaj.find({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid, kullanicidelete: false });
            await uyemesaj.updateOne({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid }, { kullanici_goruntulenmeyen_mesaj_sayisi: "0" }, { new: true });
        } else {
            mesajicerigi = await mesaj.find({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid, tamircidelete: false });
            await uyemesaj.updateOne({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid }, { tamirci_goruntulenmeyen_mesaj_sayisi: "0" }, { new: true });
        }

        if (mesajicerigi.length > 0) {
            //var gorunmeyenmesajsayilari = await uyemesaj.findOne({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid });
            //mesajicerigi.push({ kullanici_goruntulenmeyen_mesaj_sayisi: gorunmeyenmesajsayilari.kullanici_goruntulenmeyen_mesaj_sayisi, tamirci_goruntulenmeyen_mesaj_sayisi: gorunmeyenmesajsayilari.tamirci_goruntulenmeyen_mesaj_sayisi });
            // console.log(mesajicerigi);

            return res.status(200).json(mesajicerigi);
        }
        else { return res.status(400).json("kullanici mesajlari bulunamadi"); }
    }
    catch (err) { return res.status(404).json({ err }) }
}

const MesajSil = async (req, res) => { //burada id si Gönderilen mesajlar siliniyor.

    try {
        const mesajvarmi = await uyemesaj.find({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid });
        if (mesajvarmi.length > 0) {
            if (req.params.role.toString() == "kullanici") { //silme işlemi yapan kullanıcı ise
                if (mesajvarmi[0].tamircidelete == true) { //tamirci de mesajları silmiş mi.sildi ise tüm mesajlar silinir
                    await mesaj.deleteMany({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid });
                    await uyemesaj.deleteOne({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid });
                }
                else { //tamirci mesajları silmemiş ise sacede kullanıcının mesajları silinir. yani kullanıcıdelete alanları true yapılır
                    await uyemesaj.updateOne({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid }, { kullanicidelete: true, kullanici_goruntulenmeyen_mesaj_sayisi: "0" }, { new: true });
                    await mesaj.updateMany({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid }, { kullanicidelete: true }, { new: true });
                    await mesaj.deleteMany({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid, kullanicidelete: true, tamircidelete: true });
                }
            } else {//silme işlemini yapan tamirci ise
                if (mesajvarmi[0].kullanicidelete == true) { //kullanıcıda mesajları sildi ise tüm mesajlar silinir
                    await mesaj.deleteMany({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid });
                    await uyemesaj.deleteOne({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid });
                }
                else { //kullanıcı mesajları silmemiş ise sadece tamircinin mesajları silinir. yani tamircidelete alanları true yapılır
                    await uyemesaj.updateOne({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid }, { tamircidelete: true, tamirci_goruntulenmeyen_mesaj_sayisi: "0" }, { new: true })
                    await mesaj.updateMany({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid }, { tamircidelete: true }, { new: true })
                    await mesaj.deleteMany({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid, kullanicidelete: true, tamircidelete: true });

                }
            }
            //  await mesaj.deleteMany({ kullaniciid: req.body.kullaniciid, tamirciid: req.body.tamirciid });
            return res.status(200).json(200);
        }
        else {
            return res.status(400).json("Mesajlar bulunamadi");
        }
    }
    catch (err) { return res.status(404).json({ err }) }
}

module.exports = {
    mesajEkle,
    mesajGetir,
    MesajicerigiGetir,
    MesajSil
}