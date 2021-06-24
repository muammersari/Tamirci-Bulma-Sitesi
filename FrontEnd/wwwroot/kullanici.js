//bu metot yeni kullanıcı ekler
function KullaniciEkle(KullaniciBilgileri) {
    bootbox.confirm({
        title: "Bilgi",
        message: "Kullanıcı Kaydı Oluşturarak Gizlilik İlkelerini Kabul Etmiş Olursunuz. Kabul Ediyor musunuz ?",
        className: "fadeInDown animated",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Hayır'
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Evet'
            }
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    url: '/Kayit/KullaniciEkle/',
                    type: "Post",
                    dataType: 'json',
                    async: false,
                    data: KullaniciBilgileri,
                    success: function (gelenDeg) {
                        if (gelenDeg == "205") {
                            alert("Bu Email Daha Önce Kullanılmış!");
                        }
                        else if (gelenDeg == "404" || gelenDeg == "400") {
                            alert("Ekleme İşlemi Başarısız!");
                        }
                        else {
                            $(".close").click();
                            window.location = "/Tamirci/Tamirciler";

                            //var textbox = "<input class='form-control' id='tbxStadName" + gelenDeg._id + "' name='[0].stadiumName' type='text' value='" + gelenDeg.stadiumName + "'>";
                            //    var dropdown = "";
                            //    if (gelenDeg.stadStatus) dropdown = "<select class='form-control' data-val='true' data-val-required='Stad Durum alanı gereklidir.' id='drpStatus" + gelenDeg._id + "' name='[3].stadStatus'><option selected='selected' value='true'>Açık</option> <option value= 'false'>Kapalı</option></select>";
                            //    else dropdown = "<select class='form-control' data-val='false' data-val-required='Stad Durum alanı gereklidir.' id='drpStatus" + gelenDeg._id + "' name='[3].stadStatus'><option value='true'>Açık</option> <option selected='selected' value= 'false'>Kapalı</option></select>";

                            //    var btnGuncelle = "<a class='btn btn-info btn-block btnStadGuncelle' data-id='" + gelenDeg._id + "'><span class='glyphicon glyphicon-floppy-saved'></span></a>";

                            //    var btnSil = "<a class='btn btn-danger btn-block btnStadSil' data-id='" + gelenDeg._id + "'><span class='glyphicon glyphicon-trash'></span></a>";

                            //    $('#tblStadlar > tbody:last-child').append("<tr><td>" + textbox + "</td><td>" + dropdown + "</td><td>" + btnGuncelle + "</td><td>" + btnSil + "</td></tr>");
                        }
                    },
                    error: function (err) {
                    }
                });
            }
        }
    });
}
//burada id si verilen kullanicinin güncellemesi yapılıyor
function KullaniciSifresiGuncelle(kullanicibilgileri) {
    $.ajax({
        url: '/Kullanici/KullaniciSifresiGuncelle/',
        type: "Post",
        dataType: 'json',
        async: false,
        data: kullanicibilgileri,
        success: function (gelenDeg) {
            if (gelenDeg == "200") {
                alert("Şifreniz Değiştirildi");
                document.getElementById("txt_yeni_sifre").value = "";
                document.getElementById("txt_yeni_sifre_tekrar").value = "";
                cikisyap();
            }
            else {
                alert("Şifre Değiştirilemedi");
            }
        },
        error: function (err) {
        }
    });

}

function tamircikaydet(tamirciid) {
    $.ajax({
        url: '/Kullanici/Tamircikayit?tamirciid=' + tamirciid,
        type: "Post",
        success: function (gelenDeg) {
            if (gelenDeg == "200") {
                alert("Tamirci Kayıt Edildi.");
            }
            else if (gelenDeg == "205") {
                alert("Tamirci Zaten Kayıtlı");
            } else {
                alert("Kayıt Edilemedi.");
            }
        },
        error: function (err) {
        }
    });
}

function kayitlitamirci() {
    $.ajax({
        url: '/Kullanici/KayitliTamirci/',
        type: "Post",
        success: function (gelenDeg) {

            if (gelenDeg.length > 0 && gelenDeg != "404") {
                document.getElementById("tblKaydedilenler").innerHTML = ""; //div_kaydedilenler

                for (var i = 0; i < gelenDeg.length; i++) {

                    const tr = document.createElement('tr');
                    if (i != gelenDeg.length - 1) {
                        tr.className = "border-bottom border-secondary";
                    }

                    const td_isyeriadi = document.createElement("td");
                    const td_sil = document.createElement('td');
                    const td_profilegit = document.createElement('td');

                    td_isyeriadi.innerHTML = gelenDeg[i].isyeriadi;

                    const btnsil = document.createElement('input');
                    btnsil.type = "button";
                    btnsil.value = "ÇIKAR";
                    btnsil.className = "btn btn-outline-danger shadow-none";
                    btnsil.style.fontSize = "small";
                    btnsil.title = "Kaydedilenlerden Kaldırın";
                    btnsil.id = gelenDeg[i]._id;

                    const btn_profilegit = document.createElement('input');
                    btn_profilegit.type = "button";
                    btn_profilegit.value = "Profile Git";
                    btn_profilegit.className = "btn btn-outline-success shadow-none";
                    btn_profilegit.style.fontSize = "small";
                    btn_profilegit.title = "Tamirci Profiline Git";
                    btn_profilegit.id = gelenDeg[i].tamirciid;

                    td_sil.append(btnsil);
                    td_profilegit.append(btn_profilegit);
                    tr.append(td_isyeriadi);
                    tr.append(td_sil);
                    tr.append(td_profilegit);
                    document.getElementById("tblKaydedilenler").append(tr);
                    $("#" + btnsil.id + "").click(function () {
                        bootbox.confirm({
                            title: "Bilgi",
                            message: "Seçtiğiniz tamirciyi Kaydedilenlerden Çıkarmak İstediğinize Emin misiniz?",
                            className: "fadeInDown animated",
                            buttons: {
                                cancel: {
                                    label: '<i class="fa fa-times"></i> İptal'
                                },
                                confirm: {
                                    label: '<i class="fa fa-check"></i> Evet'
                                }
                            },
                            callback: function (result) {
                                if (result) {
                                    $.ajax({
                                        url: "/Kullanici/KayitliTamirciSil?kayitno=" + btnsil.id,
                                        type: "Post",
                                        success: function (gelenDeg) {
                                            if (gelenDeg == "200") {
                                                kayitlitamirci();
                                            }
                                            else if (gelenDeg == "205") {
                                                alert("Tamirci Zaten Kayıtlı");
                                            } else {
                                                alert("Kayıt Edilemedi.");
                                            }
                                        },
                                        error: function (err) {
                                        }
                                    });
                                }
                            }
                        });
                    });

                    $("#" + btn_profilegit.id + "").click(function () {
                        window.location = "/Tamirci/Tamirci_Profili?tamirciID=" + btn_profilegit.id;
                    });

                }
            } else {
                document.getElementById("div_kaydedilenler").innerHTML = "KAYITLI TAMİRCİ BULUNAMADI";
                document.getElementById("div_kaydedilenler").style.color = "darkred";

            }
        },
        error: function (err) {
        }
    });
}
//bu metot id si verilen bir kullanıcıyı getirir
//function kullaniciGetir() { //burada kullaniciları getirdik.
//    $.ajax({
//        url: '/Kullanici/KullaniciBilgileri/',
//        type: "Post",
//        dataType: 'json',
//        async: false,
//        success: function (gelenDeg) {
//            if (gelenDeg == "205") {
//                alert("205");
//            }
//            else if (gelenDeg == "404" || gelenDeg == "400") {
//                alert("404 400");
//            }
//            else {
//                //alert(gelenDeg._id + " sonunda");//burada gelen nesnenin değerine ulaşabiliyoruz.
//            }
//        },
//        error: function (err) {
//            alert("hata");
//        }
//    });
//}