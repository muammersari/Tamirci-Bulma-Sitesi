using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tamirci_Bul.Data;
using Tamirci_Bul.Models;

namespace Tamirci_Bul.Hubs
{
    public class ChatHub : Hub
    {
        public async Task GetNickName(string nickName, string alici_nickname)
        {
            Client client = new Client  //client clasına nickname i ve connection id yi gönderiyoruz
            {
                ConnectionId = Context.ConnectionId,
                NickName = nickName, // giriş yapan kişinin nickname i
                alici_NickName = alici_nickname // giriş yapılan kişinnin nickname i
            };

            Client client1 = ClientSource.Clients.FirstOrDefault(c => c.NickName == nickName.Trim() && c.alici_NickName == alici_nickname.Trim());//burada aynı kullanıcı var mı kontrol ediyoruz
            if (client1 != null) // kullanici var ise
            {
                for (int i = 0; i < ClientSource.Clients.Count(); i++)
                {
                    if (ClientSource.Clients[i].NickName == nickName && ClientSource.Clients[i].alici_NickName == alici_nickname)
                    {
                        ClientSource.Clients[i].ConnectionId = Context.ConnectionId; // burada kullanıcı daha önce kayırlı ise connectionId sini güncelliyoruz
                    }
                }
            }
            else
            {
                ClientSource.Clients.Add(client);  //burada eğer daha önce kullanıcı kayıtlı değil ise listeye kullanıcının nickname ini ve conncetionId sini ekliyoruz
            }

            await Clients.Others.SendAsync("clientJoined", nickName, alici_nickname); //burada kullanıcı giriş yaptığı zaman giriş yapan ve  giriş yapılan kişinin bilgisi gönderiliyor
        }

        public override async Task OnDisconnectedAsync(Exception exception) // burada kullanıcı sekmeyi kapatır, sayfayı yeniler veya tarayıcıyı kapatırsa çevrimdışı yapıyorz.
        {
            Client client = ClientSource.Clients.FirstOrDefault(c => c.ConnectionId == Context.ConnectionId.Trim()); // burada çıkış yapan kişinin bilgileri alınıyor
            for (int i = 0; i < ClientSource.Clients.Count(); i++)
            {
                if (ClientSource.Clients[i].ConnectionId == client.ConnectionId)
                {
                    ClientSource.Clients.RemoveAt(i);// çıkış yapan kişinin bilgileri siliniyor
                }
            }
            await Clients.Caller.SendAsync("closed", "komple_cikis"); // kullanıcı çıkış yaptığında kendisinde yapılacak işlemler için komple çıkış yaptığını gönderiyoruz
            await Clients.Others.SendAsync("disconned", client.NickName, client.alici_NickName); // çıkış yan kişinin nickname i ve kimden çıkış yaptığı bilgisi gönderiliyor
        }

        public async Task Disconned(string nickname, string alici_nickname) // burada kullanıcı sadece mesajı kapatırsa çevrimdışı yapıyoruz.
        {
            for (int i = 0; i < ClientSource.Clients.Count(); i++)
            {
                if (ClientSource.Clients[i].NickName.ToString() == nickname.ToString() && ClientSource.Clients[i].alici_NickName.ToString() == alici_nickname.ToString())
                {
                    ClientSource.Clients.RemoveAt(i); // ve çıkış yapan kişinin id sini siliyoruz
                }
            }
            //Client client1 = ClientSource.Clients.FirstOrDefault(c => c.NickName == nickname.Trim() && c.alici_NickName == alici_nickname.Trim());//burada aynı kullanıcı var mı kontrol ediyoruz
            await Clients.Caller.SendAsync("closed", "sadecemesajkapatildi");// kullanıcı çıkış yaptığında kendisinde yapılacak işlemler için sadece mesajı kapattığını gönderiyoruz
            await Clients.Others.SendAsync("disconned", nickname, alici_nickname);// çıkış yan kişinin nickname i ve kimden çıkış yaptığı bilgisi gönderiliyor
        }

        public async Task SendMessageAsync(string mesaj, string alici_nickname, string gonderen_nickName)
        {
            Client client = ClientSource.Clients.FirstOrDefault(c => c.alici_NickName == gonderen_nickName.Trim() && c.NickName == alici_nickname.Trim()); // burada mesaj alan kişinin eğer çevrimiçi olup olmadığı bulunuyor
            if (client != null) //mesajı alan kişi çevrim içi ise mesaj gonderiliyor
            {
                await Clients.Client(client.ConnectionId).SendAsync("receiveMessage", mesaj, alici_nickname, gonderen_nickName, "cevrimici"); // mesaj atılan kişiye mesaj gonderiliyor
                await Clients.Caller.SendAsync("db_message_create", mesaj, alici_nickname, "cevrimici"); // mesaj atılan kişi çevrimiçi değilse mesaj bildirimi gidiyor
            }
            else
            {
                await Clients.Others.SendAsync("receiveMessage", mesaj, alici_nickname, gonderen_nickName, "cevrimdisi"); // mesaj atılan kişi çevrimiçi değilse mesaj bildirimi gidiyor
                await Clients.Caller.SendAsync("db_message_create", mesaj, alici_nickname, "cevrimdisi"); // mesaj atılan kişi çevrimiçi değilse mesaj bildirimi gidiyor
            }
        }
    }
}
