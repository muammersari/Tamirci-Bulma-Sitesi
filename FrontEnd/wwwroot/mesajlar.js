
function mesajgonder(mesaj_atan, mesajalanid, mesaj, mesajsohbettenmi, mesaj_goruldumu) {
    var mesajbilgileri;
    if (localStorage.getItem("kullaniciTipi") == "kullanici") {
        mesajbilgileri = {
            kullaniciid: localStorage.getItem("_id"),
            tamirciid: mesajalanid.toString(),//butonun id sini tamircinin idsi olarak ayarladık
            mesajatan: mesaj_atan.toString(),
            mesaj: mesaj,
            tarih: "",
            kullanici_goruntulenmeyen_mesaj_sayisi: "0",
            tamirci_goruntulenmeyen_mesaj_sayisi: "1",
            mesajgoruldumu: mesaj_goruldumu
        }
    } else {
        mesajbilgileri = {
            tamirciid: localStorage.getItem("_id"),
            kullaniciid: mesajalanid.toString(),//butonun id sini tamircinin idsi olarak ayarladık
            mesajatan: mesaj_atan.toString(),
            mesaj: mesaj,
            tarih: "",
            kullanici_goruntulenmeyen_mesaj_sayisi: "1",
            tamirci_goruntulenmeyen_mesaj_sayisi: "0",
            mesajgoruldumu: mesaj_goruldumu
        }
    }

    if (mesaj.toString() != "") {
        $.ajax({
            url: '/Mesajlar/MesajGonder/',
            type: "Post",
            dataType: 'json',
            async: false,
            data: mesajbilgileri,
            success: function (gelenDeg) {
                if (gelenDeg == "200") {
                    if (mesajsohbettenmi == "true") {
                        // mesajicerigigetir(mesajalanid);
                    } else {
                        document.getElementById("modal_mesaj_kapat").click();
                        alert("mesaj gönderildi");
                        window.location = "/Mesajlar/Chat";
                    }

                    //document.getElementById("nav-mesajlar-tab").click();
                }
                else if (gelenDeg == "404" || gelenDeg == "400") {
                    alert("mesaj gönderme İşlemi Başarısız!");
                }
            },
            error: function (err) {
            }
        });

    } else alert("Mesajınızı Boş Bırakmayınız...");
}

//burada mesajları çektik göstermedik.gösterilmesi lazım onu yap.
function mesajicerigigetir(karsi_taraf_id) {
    document.getElementById("btn_msj_gonder").setAttribute("Name", karsi_taraf_id);
    document.getElementById("div_mesaj_icerigi").style.display = "block";
    document.getElementById("div_mesaj_alani").style.display = "none";
    var obj;
    if (localStorage.getItem("kullaniciTipi") == "kullanici") {
        obj = {
            kullaniciid: localStorage.getItem("_id"),
            tamirciid: karsi_taraf_id
        }
    } else {
        obj = {
            tamirciid: localStorage.getItem("_id"),
            kullaniciid: karsi_taraf_id
        }
    }

    $.ajax({
        url: '/Mesajlar/Mesajicerigigetir/',
        type: "Post",
        dataType: 'json',
        async: true,
        data: obj,
        success: function (gelenDeg) {
            document.getElementById("ul_mesaj_içerik").innerHTML = "";
            for (var i = 0; i < gelenDeg.length; i++) {
                var limesaj = document.createElement('li');
                if (localStorage.getItem("kullaniciTipi").toString() == gelenDeg[i].mesajatan.toString()) {
                    limesaj.className = "list-group-item rounded m-2 ml-auto list-group-item-light";
                    limesaj.style.borderRadius = "10px";
                    limesaj.style.boxShadow = "0 0 0.5px 0.5px lightgreen";
                    limesaj.style.color = "black";
                    limesaj.style.width = "auto";
                    limesaj.style.maxWidth = "75%";
                    limesaj.style.textAlign = "left";
                    limesaj.innerHTML = gelenDeg[i].mesaj.toString();
                    var zaman = document.createElement("small");
                    zaman.innerHTML = gelenDeg[i].tarih.substring(11, 16);
                    zaman.className = "d-flex justify-content-end pt-1";
                    limesaj.append(zaman);
                } else {
                    limesaj.className = "list-group-item rounded m-2 mr-auto list-group-item-success";
                    limesaj.style.borderRadius = "10px";
                    limesaj.style.boxShadow = "0 0 0.5px 0.5px lightgreen";
                    limesaj.style.color = "black";
                    limesaj.style.width = "auto";
                    limesaj.style.maxWidth = "75%";
                    limesaj.style.textAlign = "left";
                    limesaj.innerHTML = gelenDeg[i].mesaj.toString();
                    var zaman1 = document.createElement("small");
                    zaman1.innerHTML = gelenDeg[i].tarih.substring(11, 16);
                    zaman1.className = "d-flex justify-content-start pt-1";
                    limesaj.append(zaman1);
                }
                document.getElementById("ul_mesaj_içerik").append(limesaj);
            }
            //aşağıda scroll mesaj geldikçe hepen aşağıyı gösterecek
            $("#ul_mesaj_içerik").scrollTop(document.getElementById("ul_mesaj_içerik").scrollHeight);

        },
        error: function (err) {
        }
    });
}

function mesajsil(karsitarafid) {
    bootbox.confirm({
        title: "Bilgi",
        message: "Mesajı Silmek İstediğiniee Emin misiniz? Eğer Mesajı Sildiğinizde Tekrar Geri Getiremezsiniz !",
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
                var obj;
                if (localStorage.getItem("kullaniciTipi") == "kullanici") {
                    obj = {
                        kullaniciid: localStorage.getItem("_id").toString(),
                        tamirciid: karsitarafid
                    }
                } else {
                    obj = {
                        kullaniciid: karsitarafid,
                        tamirciid: localStorage.getItem("_id").toString()
                    }
                }
                $.ajax({
                    url: "/Mesajlar/MesajSil/",
                    type: "Post",
                    dataType: 'json',
                    async: true,
                    data: obj,
                    success: function (gelendeg) {
                        document.getElementById("li+" + karsitarafid + "").remove();
                        var mesajsayisi = $("#ul_mesaj").find("li").length;
                        if (mesajsayisi == 0) {
                            $("#ul_mesaj").remove();
                            document.getElementById("bosmesaj").style.display = "block";
                        }
                    },
                    error: function (err) {
                        alert(err);
                    }
                });
            }
        }
    });

}
