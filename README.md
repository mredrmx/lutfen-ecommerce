# Lütfen E-Ticaret Uygulaması

Modern, karanlık temalı bir e-ticaret web uygulaması. Next.js, Prisma ORM, SQLite, DaisyUI ve Tailwind CSS ile geliştirilmiştir.

## Özellikler
- **Kullanıcı Yönetimi:** Kayıt, giriş, profil görüntüleme/güncelleme, çıkış
- **Rol Tabanlı Erişim:** Admin ve normal kullanıcı ayrımı, admin paneli
- **Ürün Yönetimi:** Admin için ürün ekleme, düzenleme, silme
- **Sipariş Yönetimi:** Kullanıcılar için alışveriş ve sipariş geçmişi, admin için sipariş durumu yönetimi
- **Mesajlaşma:** Kullanıcılar arası metin mesajlaşma
- **Modern Karanlık Tema:** DaisyUI + Tailwind CSS ile responsive ve şık arayüz

## Kurulum
1. **Depoyu klonlayın:**
   ```bash
   git clone <proje-linki>
   cd lutfen
   ```
2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```
3. **Veritabanını başlatın:**
   ```bash
   npx prisma migrate dev --name init
   ```
4. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```
5. **Uygulamayı açın:**
   [http://localhost:3000](http://localhost:3000)

## Varsayılan Admin Kullanıcısı
İlk kullanıcılar normal kullanıcı olarak kaydolur. Admin yetkisi için veritabanında ilgili kullanıcının `role` alanını `admin` olarak güncelleyebilirsiniz.

## Klasör Yapısı
- `src/app/` : Sayfalar ve API route'ları
- `src/components/` : Ortak bileşenler (Navbar vb.)
- `prisma/` : Prisma şeması ve migration dosyaları

## Kullanılan Teknolojiler
- [Next.js](https://nextjs.org/)
- [Prisma ORM](https://www.prisma.io/)
- [SQLite](https://www.sqlite.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [JWT](https://jwt.io/) ile kimlik doğrulama

## Geliştirici Notları
- Tüm API ve sayfa erişimleri güvenlik için JWT ve middleware ile korunmaktadır.
- Responsive ve karanlık tema için DaisyUI + Tailwind kullanılmıştır.
- Kod okunabilirliği ve sürdürülebilirlik için component yapısı ve yorumlar eklenmiştir.

## Katkı ve Lisans
Katkıda bulunmak için pull request gönderebilirsiniz. Lisans bilgisi için proje sahibine danışınız.
