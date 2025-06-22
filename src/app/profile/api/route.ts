import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.split(" ")[1];
        if (!token) {
          return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
        }
    
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    
        if (!user) {
          return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
        }
        
        // Şifreyi yanıttan çıkar
        const { password, ...userWithoutPassword } = user;
    
        return NextResponse.json({ user: userWithoutPassword });
      } catch (error) {
        return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
      }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const body = await request.json();
    const { name, surname } = body;

    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: { name, surname },
    });

    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    return NextResponse.json(
      { error: "Profil güncellenemedi" },
      { status: 500 }
    );
  }
} 