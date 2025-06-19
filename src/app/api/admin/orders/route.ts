import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "ekinler_bas_vermeden_kor_buzagı_topallamazmıs";

function isAdmin(req: NextRequest) {
  const auth = req.headers.get("authorization") || req.cookies.get("token")?.value;
  if (!auth) return false;
  let token = auth;
  if (token.startsWith("Bearer ")) token = token.replace("Bearer ", "");
  try {
    const user = jwt.verify(token, JWT_SECRET) as { role: string };
    return user.role === "admin";
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
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
  if (!isAdmin(req)) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
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