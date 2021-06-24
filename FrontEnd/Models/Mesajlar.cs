using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Tamirci_Bul.Models
{
    public class Mesajlar
    {
        [JsonProperty("kullaniciid")]
        [Required(ErrorMessage = "Boş bırakılamaz")]
        public string kullaniciid { get; set; }

        [JsonProperty("tamirciid")]
        [Required(ErrorMessage = "Boş bırakılamaz")]
        public string tamirciid { get; set; }

        [JsonProperty("mesajatan")]
        [Required(ErrorMessage = "Boş bırakılamaz")]
        public string mesajatan { get; set; }

        [JsonProperty("mesaj")]
        [Required(ErrorMessage = "Boş bırakılamaz")]
        public string mesaj { get; set; }

        [JsonProperty("karsi_taraf_isim")]
        [Required(ErrorMessage = "Boş bırakılamaz")]
        public string karsi_taraf_isim { get; set; }

        [JsonProperty("tarih")]
        [Required(ErrorMessage = "Boş bırakılamaz")]
        public DateTime tarih { get; set; }

        [JsonProperty("kullanici_goruntulenmeyen_mesaj_sayisi")]
        [Required(ErrorMessage = "Boş bırakılamaz")]
        public string kullanici_goruntulenmeyen_mesaj_sayisi { get; set; }

        [JsonProperty("tamirci_goruntulenmeyen_mesaj_sayisi")]
        [Required(ErrorMessage = "Boş bırakılamaz")]
        public string tamirci_goruntulenmeyen_mesaj_sayisi { get; set; }

        [JsonProperty("mesajgoruldumu")]
        [Required(ErrorMessage = "Boş bırakılamaz")]
        public string mesajgoruldumu { get; set; }


    }
}
