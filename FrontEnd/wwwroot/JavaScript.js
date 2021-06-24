
//kullanıcının giriş yapması için kullanılan metot
function girisyap(email_sifre) {
    $.ajax({
        url: '/Anasayfa/Login/',
        type: "Post",
        dataType: 'json',
        async: true,
        data: email_sifre,
        success: function (gelenDeg) {
            if (gelenDeg == "404") {
                document.getElementById("uyari").style.color = "red";
                document.getElementById("uyari").innerHTML = "Girmiş Olduğunuz Bilgiler Hatalı...";
                document.getElementById("uyari").style.display = "block";
            }
            else {
                
                localStorage.setItem("login", "true");
                localStorage.setItem("konusuyormu", "hayir");
                localStorage.setItem("chat_acikmi", "hayir");
                window.location = "/Tamirci/Tamirciler";
                gelenDeg.forEach(function (item) {
                    localStorage.setItem("_id", item._id);
                    localStorage.setItem("kullaniciTipi", item.role);
                    localStorage.setItem("kullanicimail", item.email);
                });
                document.getElementById("giris_yap_modal_kapat").click();

            }
        },
        error: function (err) {
            hatalar = gelenDeg;
            alert(hatalar);
        }
    });
}

//kullanıcının çıkış yapması içinkullanılan metot
function cikisyap() {
    $.ajax({
        url: '/Anasayfa/LogOut/',
        type: "Post",
        dataType: 'json',
        async: false,
        success: function (gelenDeg) {
            localStorage.clear();
            window.location = "/Tamirci/Tamirciler"
        },
        error: function (err) {
            alert("çıkış hatali");
            // hatalar = gelenDeg;
        }
    });
}

//function resimgonder() {
//    var formData = new FormData()

//    formData.append('imagee', document.getElementById('image').files[0]);

//    fetch('http://localhost:3000/api/tamirci-resim-islemleri', {
//        method: 'POST',
//        body: formData,
//    }).then(r => {
//        console.log(r)
//    })
//    console.log(file[0])
//}

function resimgetir() {
    fetch('http://localhost:3000/api/tamirci-resim-islemleri')
        .then((response) => {
            return response.json();
        }).then((data) => {
            document.getElementById("tamirci_isyeri_adi").innerHTML = data[0].isyeriadi;
            document.getElementById("tamirci_ismi").innerHTML = data[0].isim + " " + data[0].soyisim;
            document.getElementById("tamirci_aciklama").innerHTML = data[0].aciklama;
            document.getElementById("tamirci_calisma_saatleri").innerHTML = data[0].calismasaatleri;
            document.getElementById("tamirci_adres").innerHTML = data[0].adres;
            console.log(data);
        })
}