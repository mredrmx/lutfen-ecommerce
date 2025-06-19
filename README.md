# Lütfen E-Ticaret

Modern ve responsive e-ticaret sitesi. Next.js, Prisma, JWT authentication ve Tailwind CSS ile geliştirilmiştir.

## 🚀 Özellikler

- **🔐 Kullanıcı Yönetimi**: Kayıt olma, giriş yapma, profil yönetimi
- **🛍️ Ürün Yönetimi**: Ürün ekleme, düzenleme, silme, öne çıkarma
- **📱 Responsive Tasarım**: Mobil ve desktop uyumlu
- **💬 Mesajlaşma Sistemi**: Kullanıcılar arası mesajlaşma
- **📦 Sipariş Yönetimi**: Sipariş oluşturma ve takip
- **👨‍💼 Admin Paneli**: Ürün ve sipariş yönetimi
- **🌙 Dark Mode**: Otomatik tema desteği

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (Prisma ORM)
- **Authentication**: JWT
- **Deployment**: Vercel (önerilen)

## 📦 Kurulum

1. **Repository'yi klonla**
```bash
git clone https://github.com/kullaniciadi/lutfen-ecommerce.git
cd lutfen-ecommerce
```

2. **Bağımlılıkları yükle**
```bash
npm install
```

3. **Environment variables oluştur**
```bash
cp .env.example .env
```

4. **Database'i hazırla**
```bash
npx prisma generate
npx prisma db push
```

5. **Development server'ı başlat**
```bash
npm run dev
```

6. **Tarayıcıda aç**
```
http://localhost:3000
```

## 🔧 Environment Variables

`.env` dosyasında şu değişkenleri tanımla:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="ekinler_bas_vermeden_kor_buzagı_topallamazmıs"
```

## 📱 Kullanım

### Kullanıcı İşlemleri
- **Kayıt Ol**: `/register` sayfasından yeni hesap oluştur
- **Giriş Yap**: `/login` sayfasından giriş yap
- **Profil**: `/profile` sayfasından bilgilerini güncelle

### Ürün İşlemleri
- **Ürünleri Görüntüle**: Ana sayfa ve `/products` sayfası
- **Ürün Yönetimi** (Admin): `/admin/products` sayfası

### Mesajlaşma
- **Mesaj Gönder**: `/messages` sayfasından diğer kullanıcılara mesaj gönder

### Admin Paneli
- **Ürün Yönetimi**: Ürün ekle, düzenle, sil, öne çıkar
- **Sipariş Yönetimi**: Siparişleri görüntüle ve yönet

## 🚀 Deployment

### Vercel ile Deploy

1. **Vercel'e bağlan**
```bash
npm install -g vercel
vercel
```

2. **Environment variables'ları Vercel'de ayarla**
3. **Database'i deploy et**

### Diğer Platformlar

- **Netlify**: Static export ile
- **Railway**: Full-stack deployment
- **Heroku**: Custom buildpack ile

## 🤝 Katkıda Bulunma

1. Fork yap
2. Feature branch oluştur (`git checkout -b feature/amazing-feature`)
3. Commit yap (`git commit -m 'Add amazing feature'`)
4. Push yap (`git push origin feature/amazing-feature`)
5. Pull Request aç

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

**Emre** - Modern web teknolojileri ile e-ticaret çözümleri

---

⭐ Bu projeyi beğendiysen yıldız vermeyi unutma!
