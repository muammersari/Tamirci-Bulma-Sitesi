using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Web;

namespace Tamirci_Bul.Models
{
    public class LoginModel
    {
        [JsonProperty("_id")]
        public string _id { get; set; }

        [JsonProperty("email")]
        public string email { get; set; }

        [JsonProperty("sifre")]
        public string sifre { get; set; }

        [JsonProperty("role")]
        public string role { get; set; }
    }
}
