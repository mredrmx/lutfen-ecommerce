import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "ekinler_bas_vermeden_kor_buzagı_topallamazmıs";

async function isAdmin(req: NextRequest) {
  // Önce Authorization header'ından token al
  const auth = req.headers.get("authorization");
  let token: string | null = auth;
  if (token && token.startsWith("Bearer ")) token = token.replace("Bearer ", "");
  
  // Eğer Authorization header'ında yoksa cookie'den al
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get("token")?.value || null;
  }
  
  if (!token) return false;
  
  try {
    const user = jwt.verify(token, JWT_SECRET) as { role: string };
    return user.role.toLowerCase() === "admin";
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            surname: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { error: "Siparişler yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const { status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Sipariş ID ve durum zorunludur." },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
            surname: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      { error: "Sipariş güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
} 