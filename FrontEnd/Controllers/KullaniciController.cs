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
    public class KullaniciController : Controller
    {
        public string baseUrl = "http://localhost:3000/api/";
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Index1()
        {
            return View();
        }
        //aşağıda sayfa yüklenirken kullanici bilgileri getiriliyor.
        public async Task<ActionResult> Kullanici_Hesap_Profili()
        {
            if (User.Identity.IsAuthenticated)
            {
                string role = User.FindFirstValue(ClaimTypes.Role).ToString();
                if (role.ToString() == "kullanici")
                {
                    using (var client = new HttpClient())
                    {
                        string id = User.FindFirstValue(ClaimTypes.NameIdentifier).ToString();
                        client.BaseAddress = new Uri(baseUrl + "kullanici/");
                        HttpResponseMessage responseTask = await client.GetAsync("kullaniciBilgileri/" + id.ToString());
                        // responseTask.Wait();
                        //var result = responseTask.Result;
                        if (responseTask.StatusCode == HttpStatusCode.OK)
                        {
                            var readTask = responseTask.Content.ReadAsAsync<Kullanicimodel>();
                            readTask.Wait();
                            return View(readTask.Result);

                        }
                        else return Json("404");
                    }
                }
                else
                {
                    return RedirectToAction("Tamirci_Hesap_Profili", "Tamirci");
                }
            }
            else
            {
                return RedirectToAction("Tamirciler", "Tamirci"); ;
            }

        }

   

        //bu metod kullanıcının şifre Bİlgilerini Günceller
        public async Task<JsonResult> KullaniciSifresiGuncelle(Kullanicimodel kullanici)
        {

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(baseUrl + "kullanici/");
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage responseTask = await client.PostAsJsonAsync(
                    baseUrl + "kullanici/kullaniciGuncelle", kullanici);
                return Json(responseTask.StatusCode);
            }
        }

        public async Task<JsonResult> Tamircikayit(string tamirciid)
        {

            using (var client = new HttpClient())
            {
                string id = User.FindFirstValue(ClaimTypes.NameIdentifier).ToString();
                List<string> tamircibilgileri = new List<string>();
                tamircibilgileri.Add(id);
                tamircibilgileri.Add(tamirciid);
                client.BaseAddress = new Uri(baseUrl + "kaydedilenler/");
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage responseTask = await client.PostAsJsonAsync(
                    baseUrl + "kaydedilenler/tamirciKaydet/", tamircibilgileri);
                return Json(responseTask.StatusCode);
            }
        }

        public async Task<JsonResult> KayitliTamirci()
        {

            using (var client = new HttpClient())
            {
                string id = User.FindFirstValue(ClaimTypes.NameIdentifier).ToString();
                client.BaseAddress = new Uri(baseUrl + "kaydedilenler/");
                HttpResponseMessage responseTask = await client.GetAsync("kayitliTamirciler/" + id.ToString());
                if (responseTask.StatusCode == HttpStatusCode.OK)
                {
                    var readTask = responseTask.Content.ReadAsAsync<IList<KayitliTamircilerModel>>();
                    readTask.Wait();
                    return Json(readTask.Result);

                }
                else return Json("404");
            }
        }

        public async Task<JsonResult> KayitliTamirciSil(string kayitno)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(baseUrl + "kaydedilenler/");
                HttpResponseMessage responseTask = await client.GetAsync("kayitlitamircisil/" + kayitno.ToString());
                return Json(responseTask.StatusCode);
            }
        }
    }
}
