import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { name, surname, email, password } = await req.json();
    
    // Gelen verileri kontrol et
    console.log("Gelen veriler:", { name, surname, email });
    
    if (!name || !surname || !email || !password) {
      return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
    }

    // E-posta kontrolü
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Bu e-posta ile zaten bir kullanıcı var." }, { status: 409 });
    }

    // Şifre hashleme
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcı oluşturma
    const user = await prisma.user.create({
      data: {
        name,
        surname,
        email,
        password: hashedPassword,
        role: 'user'
      },
    });

    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        name: user.name, 
        surname: user.surname, 
        email: user.email, 
        role: user.role 
      } 
    });

  } catch (error: any) {
    // Hata detaylarını logla
    console.error("Kayıt hatası:", error);
    
    // Prisma hataları için özel mesajlar
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: "Bu e-posta adresi zaten kullanımda." }, { status: 409 });
    }
    
    // Diğer hatalar için detaylı mesaj
    return NextResponse.json({ 
      error: "Kayıt sırasında bir hata oluştu.", 
      details: error?.message || "Bilinmeyen hata" 
    }, { status: 500 });
  }
} 