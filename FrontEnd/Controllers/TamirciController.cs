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
using System.IO;
using System.Collections;

namespace Tamirci_Bul.Controllers
{
    public class TamirciController : Controller
    {
        public string baseUrl = "http://localhost:3000/api/";

        public IActionResult Index()
        {
            return View();
        }


        [AllowAnonymous]
        public async Task<ActionResult> Tamirciler(string sehir, string kategori)
        {
            using (var client = new HttpClient())
            {
                List<string> filtre = new List<string>();
                filtre.Add(sehir);
                filtre.Add(kategori);

                client.BaseAddress = new Uri(baseUrl + "tamirci/");
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage responseTask = await client.PostAsJsonAsync(
                    baseUrl + "tamirci/tamirciList", filtre);

                if (responseTask.StatusCode == HttpStatusCode.OK)
                {
                    var readTask = responseTask.Content.ReadAsAsync<IList<Tamircimodel>>();
                    readTask.Wait();
                    return View(readTask.Result);
                }
                else return View("404");
                //client.BaseAddress = new Uri(baseUrl + "tamirci/tamirciList");
                //HttpResponseMessage responseTask = await client.GetAsync("tamirciList/"+filtre);
                //// responseTask.Wait();
                ////var result = responseTask.Result;
                //if (responseTask.StatusCode == HttpStatusCode.OK)
                //{
                //    ViewBag.aa = sehir + "ff" + kategori;
                //    var readTask = responseTask.Content.ReadAsAsync<IList<Tamircimodel>>();
                //    readTask.Wait();
                //    return View(readTask.Result);
                //}
                //else return View("404");
            }
        }

        public async Task<ActionResult> Tamirci_Profili(string tamirciID)
        {
            if (User.Identity.IsAuthenticated)
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(baseUrl + "tamirci/");
                    HttpResponseMessage responseTask = await client.GetAsync("tamirciresimbilgileri/" + tamirciID);
                    // responseTask.Wait();
                    //var result = responseTask.Result;
                    if (responseTask.StatusCode == HttpStatusCode.OK)
                    {
                        var readTask = responseTask.Content.ReadAsAsync<IList<Tamircimodel>>();
                        readTask.Wait();
                        return View(readTask.Result);
                    }
                    else return Json("404");
                }
            }
            else
            {
                return RedirectToAction("Tamirciler", "Tamirci"); ;
            }
        }

        public async Task<ActionResult> Tamirci_Hesap_Profili()
        {

            if (User.Identity.IsAuthenticated)
            {
                string id = User.FindFirstValue(ClaimTypes.NameIdentifier).ToString();
                if (User.FindFirstValue(ClaimTypes.Role) == "tamirci")
                {
                    using (var client = new HttpClient())
                    {
                        client.BaseAddress = new Uri(baseUrl + "tamirci/");
                        HttpResponseMessage responseTask = await client.GetAsync("tamirciBilgileri/" + id.ToString());
                        // responseTask.Wait();
                        //var result = responseTask.Result;
                        if (responseTask.StatusCode == HttpStatusCode.OK)
                        {
                            var readTask = responseTask.Content.ReadAsAsync<Tamircimodel>();
                            readTask.Wait();
                            return View(readTask.Result);

                        }
                        else return Json("404");
                    }
                }
                else
                {
                    return RedirectToAction("Kullanici_Hesap_Profili", "Kullanici");
                }
            }
            else
            {
                return RedirectToAction("Tamirciler", "Tamirci"); ;
            }
        }



        //bu metod tamircinin şifre Bİlgilerini Günceller
        public async Task<JsonResult> TamirciSifresiGuncelle(Tamircimodel tamirci)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(baseUrl + "tamirci/");
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage responseTask = await client.PostAsJsonAsync(
                    baseUrl + "tamirci/tamircisifreGuncelle", tamirci);
                return Json(responseTask.StatusCode);
            }
        }

        public async Task<JsonResult> TamirciBilgileriGuncelle(Tamircimodel tamirci_bilgileri)
        {
            using (var client = new HttpClient())
            {
                string id = User.FindFirstValue(ClaimTypes.NameIdentifier).ToString();
                client.BaseAddress = new Uri(baseUrl + "tamirci/");
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage responseTask = await client.PostAsJsonAsync(
                    baseUrl + "tamirci/tamircibilgileriniguncelle/" + id, tamirci_bilgileri);
                return Json(responseTask.StatusCode);
            }
        }


        [AllowAnonymous]
        [HttpPost]
        public String resimEkle()
        {
            using (var client = new HttpClient())
            {
                return "http://localhost:3000/api/tamirci/";
            }
        }


    }
}


