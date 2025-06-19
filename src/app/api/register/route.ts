import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Tüm alanlar gerekli" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalı" },
        { status: 400 }
      );
    }

    // Email formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Geçerli bir email adresi girin" },
        { status: 400 }
      );
    }

    // Email'in zaten kullanılıp kullanılmadığını kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu email adresi zaten kullanılıyor" },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 12);

    // Kullanıcıyı oluştur
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "user", // Varsayılan rol
      },
    });

    return NextResponse.json({
      message: "Kayıt başarılı",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
} 