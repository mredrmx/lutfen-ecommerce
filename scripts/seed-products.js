const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: "Nike Air Max 270",
    description: "Günlük kullanım için ideal, maksimum konfor sağlayan spor ayakkabı. Air Max teknolojisi ile üstün yastıklama.",
    price: 1299.99,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    brand: "Nike",
    category: "Spor",
    colors: JSON.stringify(["Siyah", "Beyaz", "Mavi"]),
    sizes: JSON.stringify(["36", "37", "38", "39", "40", "41", "42", "43", "44"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop"
    ]),
    featured: true
  },
  {
    name: "Adidas Ultraboost 22",
    description: "Koşu ve günlük kullanım için tasarlanmış, Boost teknolojisi ile enerji geri dönüşümü sağlayan ayakkabı.",
    price: 1899.99,
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop",
    brand: "Adidas",
    category: "Spor",
    colors: JSON.stringify(["Gri", "Siyah", "Kırmızı"]),
    sizes: JSON.stringify(["37", "38", "39", "40", "41", "42", "43", "44", "45"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"
    ]),
    featured: true
  },
  {
    name: "Puma RS-X",
    description: "Retro tasarım ile modern konforu birleştiren, günlük kullanım için ideal chunky sneaker.",
    price: 899.99,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop",
    brand: "Puma",
    category: "Casual",
    colors: JSON.stringify(["Beyaz", "Pembe", "Mavi"]),
    sizes: JSON.stringify(["36", "37", "38", "39", "40", "41", "42", "43"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"
    ]),
    featured: false
  },
  {
    name: "Converse Chuck Taylor All Star",
    description: "Klasik tasarım, her tarzla uyumlu, günlük kullanım için vazgeçilmez canvas ayakkabı.",
    price: 599.99,
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500&h=500&fit=crop",
    brand: "Converse",
    category: "Casual",
    colors: JSON.stringify(["Beyaz", "Siyah", "Kırmızı", "Mavi"]),
    sizes: JSON.stringify(["35", "36", "37", "38", "39", "40", "41", "42", "43", "44"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"
    ]),
    featured: true
  },
  {
    name: "Vans Old Skool",
    description: "Skateboard kültürünün simgesi, klasik side stripe tasarımı ile her yaştan kullanıcının favorisi.",
    price: 699.99,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=500&fit=crop",
    brand: "Vans",
    category: "Casual",
    colors: JSON.stringify(["Siyah", "Beyaz", "Gri", "Mavi"]),
    sizes: JSON.stringify(["36", "37", "38", "39", "40", "41", "42", "43", "44"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"
    ]),
    featured: false
  },
  {
    name: "New Balance 574",
    description: "Klasik retro tasarım, maksimum konfor ve dayanıklılık için tasarlanmış günlük ayakkabı.",
    price: 799.99,
    stock: 22,
    imageUrl: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&h=500&fit=crop",
    brand: "New Balance",
    category: "Günlük",
    colors: JSON.stringify(["Gri", "Mavi", "Kırmızı"]),
    sizes: JSON.stringify(["37", "38", "39", "40", "41", "42", "43", "44"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"
    ]),
    featured: false
  },
  {
    name: "Skechers Go Walk",
    description: "Hafif ve esnek tasarım, uzun yürüyüşler için ideal, maksimum konfor sağlayan ayakkabı.",
    price: 449.99,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&h=500&fit=crop",
    brand: "Skechers",
    category: "Günlük",
    colors: JSON.stringify(["Siyah", "Gri", "Mavi"]),
    sizes: JSON.stringify(["36", "37", "38", "39", "40", "41", "42", "43", "44"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"
    ]),
    featured: false
  },
  {
    name: "Nike Air Jordan 1",
    description: "Basketbol kültürünün efsanesi, retro tasarım ile modern konforu birleştiren ikonik ayakkabı.",
    price: 2499.99,
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&h=500&fit=crop",
    brand: "Nike",
    category: "Spor",
    colors: JSON.stringify(["Kırmızı", "Siyah", "Beyaz"]),
    sizes: JSON.stringify(["38", "39", "40", "41", "42", "43", "44", "45"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop"
    ]),
    featured: true
  }
];

async function seedProducts() {
  try {
    console.log('Ürünler ekleniyor...');
    
    // Önce OrderItem'ları sil (foreign key constraint)
    await prisma.orderItem.deleteMany({});
    
    // Sonra Product'ları sil
    await prisma.product.deleteMany({});
    
    // Yeni ürünleri ekle
    for (const product of sampleProducts) {
      await prisma.product.create({
        data: product
      });
    }
    
    console.log('Ürünler başarıyla eklendi!');
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts(); 