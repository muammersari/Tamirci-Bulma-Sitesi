//bu metot yeni tamirci ekler
function TamirciEkle(TamirciBilgileri) {
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
                    url: '/Kayit/TamirciEkle/',
                    type: "Post",
                    dataType: 'json',
                    async: false,
                    data: TamirciBilgileri,
                    success: function (gelenDeg) {
                        if (gelenDeg == "205") {
                            alert("Bu Email Daha Önce Kullanılmış!");
                        }
                        else if (gelenDeg == "404") {
                            alert("Ekleme İşlemi Başarısız!");
                        }
                        else if (gelenDeg == "400") {
                            alert("Ekleme İşlemi Başarısız 11!");
                        }
                        else {
                            $(".close").click();
                            window.location = "/Tamirci/Tamirciler";
                        }
                    },
                    error: function (err) {
                    }
                });
            }
        }
    });
}

//burada id si verilen tamircinin şifre güncellemesi yapılıyor
function tamircisifresiniguncelle() {
    if (localStorage.getItem("login").toString() == "true") {
        if (document.getElementById("t_txt_yeni_sifre").value == document.getElementById("t_txt_yeni_sifre_tekrar").value) {
            const tamirciList = {
                _id: localStorage.getItem("_id").toString(),
                sifre: document.getElementById('t_txt_yeni_sifre').value
            }
            $.ajax({
                url: '/Tamirci/TamirciSifresiGuncelle/',
                type: "Post",
                dataType: 'json',
                async: false,
                data: tamirciList,
                success: function (gelenDeg) {
                    if (gelenDeg == "200") {
                        alert("Şifreniz Değiştirildi");
                        //window.location.reload()
                    }
                    else {
                        alert("Şifre Değiştirilemedi");
                    }
                },
                error: function (err) {
                }
            });
        } else {
            bootbox.alert({
                message: "Lütfen Şifrenizi Tekrar Ederken Doğru Giriniz !"
            });
        }
    }
    else {
        window.location = "/Anasayfa/Tamirciler";
    }
}
//burada tamirci bilgileri güncelleniyor
function tamircibilgileriguncelle() {
    var kategoriler = [];
    for (var i = 0; i < $("#ul_kategoriliste li").children("span").length; i++) {
        kategoriler.push($("#ul_kategoriliste li").children("span")[i].id);
    }

    const tamircibilgileri = {
        isim: document.getElementById("tamirci_isim").value,
        soyisim: document.getElementById("tamirci_soyisim").value,
        email: document.getElementById("tamirci_email").value,
        isyeriadi: document.getElementById("tamirci_isyeriadi").value,
        sehir: document.getElementById("tprofil_sehir").value,
        kategori: kategoriler,
        adres: document.getElementById("tamirci_adres").value,
        aciklama: document.getElementById("tamirci_aciklama").value,
        calismasaatleri: document.getElementById("tamirci_saatler").value
    }
    var bosmu = 0;
    for (let key in tamircibilgileri) {
        if (tamircibilgileri[key] == "") {
            bosmu += 1;
        }
    }
    if (bosmu == 0) {
        $.ajax({
            url: '/Tamirci/TamirciBilgileriGuncelle/',
            type: "Post",
            dataType: 'json',
            async: true,
            data: tamircibilgileri,
            success: function (gelenDeg) {
                if (gelenDeg == "200") {
                    window.location.reload()
                    alert("Bilgileriniz Güncellendi");
                }
                else {
                    alert("Bilgileriniz Değiştirilemedi");
                }
            },
            error: function (err) {
            }
        });
    } else {
        alert("Bilgilerinizi Boş Bırakamazsınız !");
    }
}

//tamircilerden gelen resim çalışıyor.
function resim_ekle() {
    if (document.getElementById('image').files.length > 0) {
        var formData = new FormData()
        formData.append('imagee', document.getElementById('image').files[0]);
        formData.append('id', localStorage.getItem("_id"));
        if (document.getElementById('seciliresim').checked == true) {
            formData.append('durum', 'true');
        } else {
            formData.append('durum', 'false');
        }
        $.ajax({
            url: '/Tamirci/resimEkle/',
            type: 'POST',
            success: function (gelenDeg) {
                fetch((gelenDeg + 'resimEkle'), {
                    method: 'POST',
                    body: formData
                }).then((response) => {
                    return response.json();
                }).then((data) => {
                    if (data == "ayniresimvar") {
                        alert("Aynı Resmi Daha Önce Eklendiniz. Lütfen Farklı Bir Resim Seçiniz !");
                    } else if (data == "resimsayisialti") {
                        alert("En Fazla 6 Adet Resim Ekleyebilirsiniz !");
                    } else if (data == "200") {
                        resimgetir();
                    } else {
                        alert("Bir Hata Oluştu Lütfen Daha Sonra Tekrar Deneyiniz !");
                    }
                }).catch((err) => { alert(err) })
            },
            error: function (err) {
            }
        });
    } else {
        alert("Lütfen Dosya Seçiniz");
    }
}

function resimgetir() {
    $.ajax({
        url: '/Tamirci/resimEkle/',
        type: 'POST',
        success: function (gelenDeg) {
            fetch(gelenDeg + '/resimGetir/' + localStorage.getItem("_id").toString())
                .then((response) => {
                    return response.json();
                }).then((data) => {
                    console.log(data);
                    document.getElementById('div_col').innerHTML = "";
                    var seciliresimvarmi = "yok";
                    if (data.length == 0) {
                        document.getElementById("div_anaresim").innerHTML = "";
                    }

                    for (var i = 0; i < data.length; i++) {
                        //burada kullanıcıdan gelen resimleri yan yana küçük boyutlar halinde gösterdik.
                        const div_resimcerceve = document.createElement('div');
                        div_resimcerceve.style.height = "auto";
                        div_resimcerceve.style.width = "auto";
                        div_resimcerceve.style.maxWidth = "15%";
                        div_resimcerceve.style.display = "inline-block";

                        const img = document.createElement('img');
                        img.src = "data:image/png;base64," + data[i].base64; //base64 ile veritabınında gelen resim datasını atadık.
                        img.setAttribute("style", "object-fit:cover");//resmi boyutunu resmi bozmadan orantılı olarak ayarlıyor
                        img.style.height = "auto";
                        img.style.maxHeight = "110px";
                        // img.style.maxHeight = "90%";
                        img.style.width = "auto";
                        img.style.maxWidth = "90%";
                        img.className = "kucukresim";
                        img.id = i;
                        //img.style.marginTop = "5%";

                        if (data[i].durum == "true") {
                            img.className = "secilikucukresim";
                            img.style.boxShadow = "0px 0px 5px 1px red";
                            img.title = "Ana Ekranda Görünecek Resim";
                        } else {
                            img.style.border = "none";
                        }

                        div_resimcerceve.append(img);
                        document.getElementById("div_col").append(div_resimcerceve);

                        document.getElementById("divresimayar").innerHTML = "";
                        if (data.length > 1) {
                            const divresimayar = document.createElement('div');
                            divresimayar.style.height = "auto";
                            divresimayar.style.width = "100%";

                            const btnsec = document.createElement('input');
                            btnsec.type = "button";
                            btnsec.value = "SEÇ";
                            btnsec.className = "btn btn-outline-success shadow-none";
                            btnsec.style.fontSize = "small";
                            btnsec.title = "Ana Menüde Görünecek Resim Olarak Ayarla.";
                            btnsec.id = "sec" + data[i]._id;
                            divresimayar.append(btnsec);

                            const btnsil = document.createElement('input');
                            btnsil.type = "button";
                            btnsil.value = "SİL";
                            btnsil.className = "btn btn-outline-danger shadow-none";
                            btnsil.style.fontSize = "small";
                            btnsil.style.marginLeft = "10px";
                            btnsil.id = "sil" + data[i]._id;
                            btnsil.title = "Resimi Sil";
                            divresimayar.append(btnsil);

                            document.getElementById("divresimayar").append(divresimayar);
                            //buton 'seç' e tıkladığımızda gösterilecek resmi değiştiriyoruz
                            $("#" + btnsec.id + "").click(function () {
                                //alert("seç " + localStorage.getItem("resimid"));
                                resimdurumguncelle(localStorage.getItem("resimid"), localStorage.getItem("_id"));
                            });
                            //buton 'sil' e tıkladığımızda resmi siliyoruz
                            $("#" + btnsil.id + "").click(function () {
                                resimsil(localStorage.getItem("resimid"), localStorage.getItem("_id"));
                            });
                        }

                        $("#" + img.id + "").click(function () {
                            //burada küçük resimlere tıklandığında büyük resim olarak göstermek için buyukresimgoster() fonksiyonuna gönderdik
                            buyukresimgoster(data[img.id].base64, data[img.id]._id, data[img.id].durum);
                        });
                        if (data[i].durum == "true" || (i == data.length - 1 && seciliresimvarmi == "yok")) {
                            // burada seçili resim var mı kontrol ediliyor eğer varsa seçili olan resim gösteriliyor.
                            //eğer seçili resim yoksa son resim gösteriliyor
                            seciliresimvarmi = "var";
                            document.getElementById("" + img.id + "").click();
                        }
                    }
                })
        },
        error: function (err) {
        }
    });
}

function resimsil(resimid, tamirciid) {
    bootbox.confirm({
        title: "Bilgi",
        message: "Ekranda Büyük Olarak Gösterilen Resmi Silmek İstediğinize Emin misiniz ?",
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
                    url: '/Tamirci/resimEkle/',
                    type: 'POST',
                    success: function (gelenDeg) {
                        fetch(gelenDeg + '/resimsil/' + resimid + '/' + tamirciid)
                            .then((response) => {
                                return response;
                            }).then((data) => {
                                if (data.status == "200") {
                                    resimgetir();
                                }
                            })
                    },
                    error: function (err) {
                    }
                });
            }
        }
    });
}
function resimdurumguncelle(resimid, tamirciid) {
    if (localStorage.getItem("resimdurum") == "true") { alert("Seçmiş Olduğunuz Resim Şu An Ana Resim Olarak Kayıtlı."); }
    else {
        bootbox.confirm({
            title: "Bilgi",
            message: "Ekranda Büyük Olarak Gösterilen Resmi Ana Resim Olarak Seçmek İstediğinize Emin misiniz ?",
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
                        url: '/Tamirci/resimEkle/',
                        type: 'POST',
                        success: function (gelenDeg) {
                            fetch(gelenDeg + '/resimdurumuguncelle/' + resimid + '/' + tamirciid)
                                .then((response) => {
                                    return response;
                                }).then((data) => {
                                    if (data.status == "200") {
                                        resimgetir();
                                    }
                                })
                        },
                        error: function (err) {
                        }
                    });
                }
            }
        });
    }
}

function buyukresimgoster(base64, resimid, durum) {

    //büyük resmin eklendiği fonksiyon
    localStorage.setItem("resimid", resimid.toString());
    localStorage.setItem("resimdurum", durum.toString());
    document.getElementById("div_anaresim").innerHTML = "";

    const div_resimcerceve1 = document.createElement('div');
    div_resimcerceve1.style.height = "auto";
    div_resimcerceve1.style.width = "auto";
    div_resimcerceve1.style.maxWidth = "100%";

    const img1 = document.createElement('img');
    img1.src = "data:image/png;base64," + base64;//base64 ile veritabınında gelen resim datasını atadık.
    img1.setAttribute("style", "object-fit:contain");//resmi boyutunu resmi bozmadan orantılı olarak ayarlıyor
    img1.style.height = "auto";
    img1.style.maxHeight = "400px";
    img1.style.width = "auto";
    img1.style.maxWidth = "80%";
    img1.style.boxShadow = "0px 0px 7px 1px gray";
    img1.id = "b" + resimid;
    if (durum == "true") { //burada seçili olan resmi kırmızı çerçeve içinde gösterdik
        img1.style.boxShadow = "0px 0px 7px 1px red";
    }
    div_resimcerceve1.append(img1);
    document.getElementById("div_anaresim").append(div_resimcerceve1);
}


