

Last login: Mon Apr 13 16:58:58 2026 from 213.142.151.108
root@92-60-70-132:~# docker system prune -af
Deleted Containers:
db6fe4de8c8f102efa87807c71ddbff759821e615f60f5af2de9ba8a8d2bc5c4
3630f43ff7f9aa2c73821e47cf33314a6877b8d48f615abc428fd2eaf51062ad
a2418e807b7033c30904dea48bde57236932b0cb1c5e957f645260eaff42977e
# Coolify Dağıtım (Deploy) Rehberi

Bu proje, açık kaynaklı sunucu yönetim aracı **Coolify** üzerinde sorunsuz, sıfır-kesintili (zero-downtime) SSL'li bir şekilde çalıştırılmak üzere yapılandırılmıştır.

Local sunucudaki Nginx yapıları ve port çakışmaları temizlenmiş, bunun yerine Coolify'ın yerleşik Ters Vekil (Traefik) sistemine %100 uyumlu `docker-compose.coolify.yml` dosyası sunulmuştur. Eğer uygulamayı Coolify'ın yüklü olduğu sunucudan farklı bir sunucuya kuracaksanız (Remote Server), aşağıdaki adımları takip edin.

## Uzak Sunucu (Remote Server) Ekleme Adımları

Eğer Coolify farklı bir sunucuda, site ise yeni aldığınız farklı bir sunucuda olacaksa şu adımları izleyin:

### 1. SSH Anahtarı Tanımlama
1. Coolify panelinde sağ menüden **Keys & Tokens** kısmına gidin.
2. **+ Add** butonuna basın ve bir isim verin (Örn: `yeni-sunucu-key`).
3. Coolify size bir **Public Key** verecektir. Bu anahtarı kopyalayın.

### 2. Yeni Sunucuyu Yetkilendirme
Yeni sunucunuza (Ubuntu 22) SSH ile girin ve aşağıdaki komutu çalıştırarak Coolify anahtarını sunucuya ekleyin:
```bash
mkdir -p ~/.ssh && echo "BURAYA_COOLIFYDEN_KOPYALANAN_ANAHTAR" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys
```

### 3. Sunucuyu Coolify'a Kaydetme
1. Coolify panelinde **Servers** sekmesine gidin.
2. **+ Add** butonuna basın.
3. IP adresi kısmına yeni sunucunuzun IP'sini girin.
4. User kısmına `root` yazın.
5. SSH Key kısmından az önce oluşturduğunuz `yeni-sunucu-key` anahtarını seçin.
6. **Save Server** dedikten sonra **Validate Server** butonuna basın.
7. Sunucu durumu **"Ready"** olduğunda işlem tamamdır.

## Adım Adım Kurulum

### 1. Kaynak Ekleyin
1. Coolify panelinize giriş yapın ve yeni bir proje **(New Project)** oluşturun.
2. Sol menüden **+ Add Resource** butonuna basın.
3. Listeden **Docker Compose** seçeneğini bulun ve üzerine tıklayın.

### 2. Github veya Dosya Olarak Tanımlama
*Eğer Github bağlandıysanız:* Repository'nizi seçin. Coolify size projenizin hangi yolunu kullanacağını soracaktır. Klasör tabanlı dağıtım yerine, Github bağlantısında direkt bu projeyi seçin.
*Dosya olarak verecekseniz:* Açılan boş Docker Compose editörüne, projede yarattığımız `docker-compose.coolify.yml` dosyasının içeriğini kopyalayıp yapıştırın.

### 3. Yapılandırmaları Ayarlayın
Dosya içeri aktarıldıktan sonra Coolify size 3 adet konteyner (web, api, admin) ve 2 adet db (postgres, redis) çıkaracaktır. Asıl işlemler burada başlıyor:

**A. Domain (Alan Adı) Yönlendirmeleri:**
- `web` servisine tıklayın. Domain kısmına ana sitenizi girin: *https://siteniz.com*
- `admin` servisine tıklayın. Domain kısmına *https://admin.siteniz.com* girin.
- `api` servisine tıklayın. Domain kısmına *https://api.siteniz.com* girin.
*(Coolify otomatik olarak her domain için Let's Encrypt SSL sertifikasını indirecek ve uygulayacaktır).*

**B. Ortam Değişkenleri (.env) Eklemeleri:**
Her servisin "Environment Variables" sekmesine gidin. Coolify bunları okumak zorundadır:
*(Özellikle API servisinde veritabanı yolları hayati önem taşır)*

```env
# API İçin
NODE_ENV=production
DATABASE_URL=postgresql://postgres:U1uOcMz9bKY10Gujg47xin65SE33UCoEpARDGABBVjiYlUL6LVAOls7w3ygqqaov@postgres:5432/ecommerce?schema=public
REDIS_URL=redis://redis:6379
JWT_SECRET=super_secret_uretilen_key
PAYTR_MERCHANT_ID=sizin_paytr_id
PAYTR_MERCHANT_KEY=sizin_paytr_key
PAYTR_MERCHANT_SALT=sizin_paytr_salt

# WEB ve ADMIN İçin
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.siteniz.com
NEXT_PUBLIC_SITE_URL=https://siteniz.com
```

### 4. Deploy (Yayınla)
Tüm environmentları kaydettikten sonra sağ üstteki devasa **Deploy** butonuna basın.
- Coolify önce Container'larınızın Dockerfile'larını okur (`apps/web/Dockerfile`, `apps/api/Dockerfile`).
- Hepsini derler (Build eder).
- Network yapılarını kurup Postgres ve Redis'i ayaklandırır.
- Eğer başarılıysa domainlerinizi Traefik'e yazarak trafiği açar!

> **İpucu:** Eğer `api` çökerse "Logs" panelinden veritabanı (DATABASE_URL) bağlantısını kontrol edin. Compose içerisinde `postgres` kelimesi host ismi olarak görev yapar. (Örn: `postgresql://x:y@postgres:5432/...`)
