using Microsoft.AspNetCore.Mvc;
using Nancy.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Tamirci_Bul.Models;
using Microsoft.AspNetCore.Components;
using Newtonsoft.Json;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication.Cookies;
namespace Tamirci_Bul.Controllers
{
    public class KayitController : Controller
    {
        public string baseUrl = "http://localhost:3000/api/";

        public IActionResult Index()
        {
            return View();
        }
        [AllowAnonymous]
        public IActionResult KayitOl()
        {
            return View();
        }

        //bu metod yeni bir kullanici ekler
        [AllowAnonymous]
        public async Task<JsonResult> KullaniciEkle(Kullanicimodel kullanici_bilgileri)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(baseUrl + "kullanici/");
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage responseTask = await client.PostAsJsonAsync(
                    baseUrl + "kullanici/kullaniciEkle", kullanici_bilgileri);

                if (responseTask.StatusCode == HttpStatusCode.OK)
                {
                    var readTask = responseTask.Content.ReadAsAsync<Kullanicimodel>();
                    readTask.Wait();
                    return Json(readTask.Result);
                }
                else return Json(responseTask.StatusCode);

            }
        }

        //bu metod yeni bir tamirci ekler
        [AllowAnonymous]
        public async Task<JsonResult> TamirciEkle(Tamircimodel tamirci_bilgileri)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(baseUrl + "tamirci/");
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage responseTask = await client.PostAsJsonAsync(
                    baseUrl + "tamirci/tamirciEkle", tamirci_bilgileri);

                if (responseTask.StatusCode == HttpStatusCode.OK)
                {
                    var readTask = responseTask.Content.ReadAsAsync<Tamircimodel>();
                    readTask.Wait();
                    return Json(readTask.Result);
                }
                else return Json(responseTask.StatusCode);

            }
        }
    }
}
