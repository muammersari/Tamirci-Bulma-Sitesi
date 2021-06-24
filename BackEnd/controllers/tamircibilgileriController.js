const tamirci = require('../models/tamircibilgileriModel')
const tamirciresim = require('../models/tamirciresimleriModel')

var fs = require('fs');
var path = require('path');
var multer = require('multer');
const mongoose = require('mongoose');


//bu metod yeni bir kullanıcı oluşturur.
const tamirciEkle = async (req, res) => {
    try {
        var mailadresivarmi = await tamirci.findOne({ email: req.body.email })//girilen mail adresi daha önce kullanılıp kullanılmadığını tespit etmek için.
        if (mailadresivarmi) {
            return res.status(205).json({ msg: "Bu Mail Adresi Kullanılıyor!" })
        }
        else {//girilen değerler uygun ise kullanıcıyı kayıt eder.
            //delete req.body._id
            delete req.body.resimler
            const yenitamirci = new tamirci(req.body)
            const post = await yenitamirci.save();
            if (post) {
                const id = await tamirci.findOne({ email: req.body.email }, "_id")
                var obj = {
                    tamirciid: id,
                    durum: "true",
                    resimler: {
                        data: fs.readFileSync(path.join('./uploads/car.png')),
                        contentType: 'image/png'
                    }
                }
                tamirciresim.create(obj, (err, item) => {
                    if (err) {
                        console.log("404");
                    }
                    else {
                        item.save();
                    }
                });
                return res.status(200).json(post)
            }
            else return res.status(400).json({ msg: "Kayıt Oluşturulamadı!" })
        }
    }
    catch (err) { return res.status(404).json({ err }) }
}


//bu metod tüm tamircilerin bilgilerini ve tamircinin seçili olan resminin base64 kodunu gönderdik
const tamirciList = async (req, res) => {
    try {
        var tamirci_bilgi_resim = [];
        var tamirciliste;
        if (req.body[0] != null && req.body[1] == null) {
            tamirciliste = await tamirci.find({ sehir: req.body[0] });
        }
        else if (req.body[0] == null && req.body[1] != null) {
            tamirciliste = await tamirci.find({ kategori: { $all: [req.body[1]] } });
        }
        else if (req.body[0] != null && req.body[1] != null) {
            tamirciliste = await tamirci.find({ sehir: req.body[0], kategori: { $all: [req.body[1]] } });
        }
        else {
            tamirciliste = await tamirci.find({});
        }
        for (let i = 0; i < tamirciliste.length; i++) {
            var resimbase64 = await tamirciresim.findOne({ tamirciid: tamirciliste[i]._id, durum: "true" }, "resimler");
            tamirci_bilgi_resim.push({
                _id: tamirciliste[i]._id,
                isyeriadi: tamirciliste[i].isyeriadi,
                aciklama: tamirciliste[i].aciklama,
                kategori: tamirciliste[i].kategori,
                resimler: resimbase64.resimler.data.toString('base64')
            });
        }
        return res.status(200).json(tamirci_bilgi_resim);
        /*  tamirciresim.aggregate([
              {
                  $lookup: {
                      from: "Tamirci", //hangi tablo ile eşleceşecek
                      localField: "tamirciid", //tamirciresimleri tablosundaki tamirciid ile
                      foreignField: "_id", // tamircibilgileri tablosundaki _id değeri eşleşen verileri
                      as: "tamirciler"// tamirciler değişkenine aktardık
                  },
              },
              {
                  $match: {
                      durum: "true" // tamircinin resimlerinden durumu true olanı aldık
                  }
              },
              {
                  $unwind: "$tamirciler"
              },
              {
                  $project: {
                      _id: false, // burada otomatik olarak resimin id sini atadığı için false yapıp görünmesine izin vermedik
                      _id: "$tamirciler._id", // burada da_id değeri olarak tamircinin id sini gösterdik.
                      isim: "$tamirciler.isim",
                      soyisim: "$tamirciler.soyisim",
                      isyeriadi: "$tamirciler.isyeriadi",
                      aciklama: "$tamirciler.aciklama",
                      //durum: true,
                      resimler: true
                  }
              }
          ], (error, veri) => {
              if (!error) {
                  veri.forEach(element => {
                      //burada resimler değişkenine resimin base64 kodunu attık
                      element.resimler = element.resimler.data.toString('base64')
                  });
                  return res.status(200).json(veri)
              }
              else
                  console.log("Beklenmeyen bir hata ile karşılaşıldı.", error.message);
          });*/

    }
    catch (err) { return res.status(404).json({ err }) }
}
//bu metod body kısmında gönderilen tamirci şifresini günceller.
const tamircisifreGuncelle = async (req, res) => {
    try {
        const tamirci_bilgileri = await tamirci.findById({ _id: req.body._id })
        if (tamirci_bilgileri) {//gönderilen id kontol ediliyor.
            const post = await tamirci.findByIdAndUpdate({ _id: req.body._id }, { sifre: req.body.sifre }, { new: true })
            if (post) return res.status(200).json(post)
        }
        else return res.status(400).json({ msg: 'Kullanıcı Bulunamadı!' })
    }
    catch (err) {
        return res.status(404).json({ err })
    }

}

//bu metod body kısmında gönderilen tamirci bilgilerini günceller.
const tamircibilgileriniguncelle = async (req, res) => {
    try {
        const tamirci_bilgileri = await tamirci.findById({ _id: req.params.id })
        if (tamirci_bilgileri) {//gönderilen id kontol ediliyor.
            const post = await tamirci.findByIdAndUpdate({ _id: req.params.id },
                {
                    isim: req.body.isim,
                    soyisim: req.body.soyisim,
                    email: req.body.email,
                    isyeriadi: req.body.isyeriadi,
                    sehir: req.body.sehir,
                    kategori: req.body.kategori,
                    adres: req.body.adres,
                    aciklama: req.body.aciklama,
                    calismasaatleri: req.body.calismasaatleri
                }, { new: true })
            if (post) return res.status(200).json(post)
        }
        else return res.status(400).json({ msg: 'Kullanıcı Bulunamadı!' })
    }
    catch (err) {
        return res.status(404).json({ err })
    }

}

//bu metod id değeri parametre olarak gönderilen kullanıcının bilgilerini geri gönderir.
const tamirciBilgileri = async (req, res) => {
    try {
        const gelentamirci = await tamirci.findById({ _id: req.params.id })//ilgili kullanıcının bütün bilgileri listelendi.
        if (gelentamirci) {
            return res.status(200).json(gelentamirci)
        }
        else
            return res.status(400).json({ "msg": "Kullanıcı Bulunamadı!" })
    }
    catch (err) { return res.status(404).json({ "msg": err }) }
}
//bu metod id değeri parametre olarak gönderilen kullanıcının bilgilerini ve resimlerini geri gönderir.
const tamirciresimbilgileri = async (req, res) => {
    try {
        tamirciresim.aggregate([
            {
                $match: {
                    tamirciid: mongoose.Types.ObjectId(req.params.id) // tamircinin resimlerinden durumu true olanı aldık
                }
            },
            {
                $lookup: {
                    from: "Tamirci", //hangi tablo ile eşleceşecek
                    localField: "tamirciid", //tamirciresimleri tablosundaki tamirciid ile
                    foreignField: "_id", // tamircibilgileri tablosundaki _id değeri eşleşen verileri
                    as: "tamirciler"// tamirciler değişkenine aktardık
                },
            },

            {
                $unwind: "$tamirciler"
            },
            {
                $project: {
                    _id: false, // burada otomatik olarak resimin id sini atadığı için false yapıp görünmesine izin vermedik
                    _id: "$tamirciler._id", // burada da_id değeri olarak tamircinin id sini gösterdik.
                    isim: "$tamirciler.isim",
                    soyisim: "$tamirciler.soyisim",
                    isyeriadi: "$tamirciler.isyeriadi",
                    aciklama: "$tamirciler.aciklama",
                    calismasaatleri: "$tamirciler.calismasaatleri",
                    adres: "$tamirciler.adres",
                    durum: "$tamirciler.durum",
                    kategori: "$tamirciler.kategori",
                    resimler: true
                }
            }
        ], (error, veri) => {
            if (!error) {
                veri.forEach(element => {
                    //burada resimler değişkenine resimin base64 kodunu attık
                    element.resimler = element.resimler.data.toString('base64')
                });
                return res.status(200).json(veri)
            }
            else
                console.log("Beklenmeyen bir hata ile karşılaşıldı.", error.message);
        });

    }
    catch (err) { return res.status(404).json({ "msg": err }) }
}

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + 'muammer')
    }
});
var upload = multer({ storage: storage });
//bu metod tamircinin resimlerini ekler.

const resimEkle = (req, res) => {
    upload.single('imagee')(req, res, /*async*/ function (error) {
        //console.log(req.file);
        if (error) {
            return res.sendStatus(500);
        } else {
            tamirciresim.find({ tamirciid: req.body.id }, (err, items1) => {
                if (items1.length < 6) {
                    tamirciresim.find({ tamirciid: req.body.id }, (err, items2) => {
                        var ayniresimvarmi = "yok";
                        items2.forEach(veri => {
                            if (veri.resimler.data.toString('base64') == fs.readFileSync(path.join('./uploads/' + req.file.filename)).toString("base64")) {
                                ayniresimvarmi = "var";
                            }
                        });
                        if (ayniresimvarmi == "yok") {
                            if (req.body.durum == "true") {
                                tamirciresim.find({ tamirciid: req.body.id, durum: "true" }, (err, items3) => {
                                    if (items3.length > 0) {
                                        tamirciresim.findOne({ tamirciid: req.body.id, durum: "true" }, (err, user) => {
                                            user.durum = "false";
                                            user.save();
                                        });
                                        ekle();
                                    }
                                    else ekle()
                                });
                            }
                            else {
                                tamirciresim.find({ tamirciid: req.body.id, durum: "true" }, (err, items3) => {
                                    if (items3.length == 0) {
                                        req.body.durum = "true"
                                        ekle()
                                    } else ekle()
                                });
                            }
                        }
                        else return res.json("ayniresimvar");
                    });

                } else return res.json("resimsayisialti");
            });
        }
        function ekle() {
            var obj = {
                tamirciid: req.body.id,
                durum: req.body.durum,
                resimler: {
                    data: fs.readFileSync(path.join('./uploads/' + req.file.filename)),
                    contentType: 'image/png'
                }
            }
            tamirciresim.create(obj, (err, item) => {
                if (err) {
                    console.log("404");
                }
                else {
                    item.save();
                    return res.json("200");
                    // res.redirect('/');
                }
            });
        }
    })
}
//id si verilen resimleri getirir
const resimGetir = async (req, res) => {
    tamirciresim.find({ tamirciid: req.params.id }, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            var resimbilgileri = [];
            items.forEach(veri => {
                resimbilgileri.push({
                    tamirciid: veri.tamirciid,
                    base64: veri.resimler.data.toString('base64'),
                    _id: veri._id,
                    durum: veri.durum
                });
                /*  resimbilgileri.push({base64:veri.resimler.data.toString('base64')});
                  resimbilgileri.push({_id:veri._id});
                  resimbilgileri.push({durum:veri.durum});*/
            });

            res.send(resimbilgileri);

            //console.log(items[0].resimler.data.toString('base64'));

        }
    });
}
//bu metod tamircinin resim durumunu günceller
const resimdurumuguncelle = async (req, res) => {
    try {
        const tamirci_resimleri = await tamirciresim.findById({ _id: req.params.resimid })
        if (tamirci_resimleri) {//gönderilen id kontol ediliyor.
            tamirciresim.find({ tamirciid: req.params.tamirciid, durum: "true" }, (err, items) => { // durumu true olan resim var mı kontrol ediliyor
                if (items.length > 0) {//durumu true olan resim varsa işlemler yapılıyor
                    tamirciresim.findOne({ tamirciid: req.params.tamirciid, durum: "true" }, (err, user) => {
                        user.durum = "false";
                        user.save();
                        tamirciresim.findOne({ tamirciid: req.params.tamirciid, _id: req.params.resimid }, (err, user1) => {
                            user1.durum = "true";
                            user1.save();
                            return res.status(200).json("guncelleme okey");
                        });
                    });
                } else {
                    tamirciresim.findOne({ tamirciid: req.params.tamirciid, _id: req.params.resimid }, (err, user2) => {
                        user2.durum = "true";
                        user2.save();
                        return res.status(200).json("guncelleme okey");
                    });
                }
            });
        }
        else return res.status(400).json({ msg: 'Kullanıcı Bulunamadı!' })
    }
    catch (err) {
        return res.status(404).json({ err })
    }

}

//bu metod tamircinin resim durumunu günceller
const resimsil = async (req, res) => {
    try {
        const tamirci_resimleri = await tamirciresim.findById({ tamirciid: req.params.tamirciid, _id: req.params.resimid })
        if (tamirci_resimleri) {//gönderilen id kontol ediliyor.
            var post = await tamirciresim.findByIdAndDelete({ _id: req.params.resimid, tamirciid: req.params.tamirciid })
            if (post) {
                tamirciresim.find({ tamirciid: req.params.tamirciid }, (err, items1) => {
                    if (items1.length > 0) {
                        tamirciresim.find({ tamirciid: req.params.tamirciid, durum: "true" }, (err, items) => {
                            if (items.length == 0) {
                                tamirciresim.findOne({ tamirciid: req.params.tamirciid }, (err, user) => {
                                    user.durum = "true";
                                    user.save();
                                });
                            }
                        });
                    } else {
                        var obj = {
                            tamirciid: req.params.tamirciid,
                            durum: "true",
                            resimler: {
                                data: fs.readFileSync(path.join('./uploads/car.png')),
                                contentType: 'image/png'
                            }
                        }
                        tamirciresim.create(obj, (err, item) => {
                            if (err) {
                                console.log("404");
                            }
                            else {
                                item.save();
                            }
                        });
                    }
                });

                return res.status(200).json()
            }
            else
                return res.status(400).json({ msg: 'Silme İşlemi Başarısız!' })
        }
        else return res.status(400).json({ msg: 'Resim Bulunamadı!' })
    }
    catch (err) {
        return res.status(404).json({ err })
    }

}
module.exports = {
    tamirciEkle,
    tamirciList,
    tamirciBilgileri,
    tamircisifreGuncelle,
    resimEkle,
    resimGetir,
    resimdurumuguncelle,
    resimsil,
    tamircibilgileriniguncelle,
    tamirciresimbilgileri
}