using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Web;

namespace Tamirci_Bul.Models
{
    public class Kullanicimodel
    {
        [JsonProperty("_id")]
        public string _id { get; set; }

        [JsonProperty("isim")]
        [Required(ErrorMessage = "Boş bırakılamaz")]
        public string isim { get; set; }

        [JsonProperty("soyisim")]
        [Required(ErrorMessage = "Boş bırakılamaz")]
        public string soyisim { get; set; }

        [JsonProperty("email")]
        [Required(ErrorMessage = "Boş bırakılamaz")]
        [DataType(DataType.EmailAddress, ErrorMessage = "Uygun formatta değil")]
        public string email { get; set; }

        [JsonProperty("sifre")]
        [Required(ErrorMessage = "Boş bırakılamaz")]
        [MinLength(6, ErrorMessage = "En az 6 haneli olmalı")]
        public string sifre { get; set; }

        [JsonProperty("sehir")]
        [Required(ErrorMessage = "Boş bırakılamaz")]
        public string sehir { get; set; }

        [JsonProperty("olusturulmatarihi")]
        public string olusturulmatarihi { get; set; }

        [JsonProperty("durum")]
        public string durum { get; set; }

        [JsonProperty("role")]
        public string role { get; set; }
    }
}
