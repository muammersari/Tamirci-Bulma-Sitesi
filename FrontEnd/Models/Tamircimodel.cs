using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Tamirci_Bul.Models
{
    public class Tamircimodel
    {
        [JsonProperty("_id")]
        public string _id { get; set; }
        [Display(Name = "name")]
        [JsonProperty("isim")]
        public string isim { get; set; }
        public string soyisim { get; set; }
        public string email { get; set; }
        public string isyeriadi { get; set; }
        public string sehir { get; set; }
        public string adres { get; set; }
        public string aciklama { get; set; }
        public string sifre { get; set; }
        public string calismasaatleri { get; set; }
        public string olusturulmatarihi { get; set; }
        public string durum { get; set; }
        public string[] kategori { get; set; }

        [JsonProperty("role")]
        public string role { get; set; }

        [JsonProperty("resimler")]
        public string resimler { get; set; }

    }
}
