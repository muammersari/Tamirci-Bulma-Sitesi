using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Tamirci_Bul.Models
{
    public class KayitliTamircilerModel
    {
        [JsonProperty("_id")]
        [Required(ErrorMessage = "Boş bırakılamaz")]
        public string _id { get; set; }

        [JsonProperty("kullaniciid")]
        [Required(ErrorMessage = "Boş bırakılamaz")]
        public string kullaniciid { get; set; }

        [JsonProperty("tamirciid")]
        [Required(ErrorMessage = "Boş bırakılamaz")]
        public string tamirciid { get; set; }

        [JsonProperty("isyeriadi")]
        [Required(ErrorMessage = "Boş bırakılamaz")]
        public string isyeriadi { get; set; }
    }
}
