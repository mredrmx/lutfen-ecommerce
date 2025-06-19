import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "ekinler_bas_vermeden_kor_buzagı_topallamazmıs";

function getUserId(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  let token = auth;
  if (token.startsWith("Bearer ")) token = token.replace("Bearer ", "");
  try {
    const user = jwt.verify(token, JWT_SECRET) as { id: number };
    return user.id;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const { items } = await req.json();
  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Sepet boş." }, { status: 400 });
  }
  // Stok kontrolü
  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product || product.stock < item.quantity) {
      return NextResponse.json({ error: `Yetersiz stok: ${product?.name || "Ürün"}` }, { status: 400 });
    }
  }
  // Sipariş ve OrderItem oluştur
  const order = await prisma.order.create({
    data: {
      userId,
      status: "Beklemede",
      items: {
        create: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: true },
  });
  // Stokları güncelle
  for (const item of items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }
  return NextResponse.json({ order });
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: { include: { product: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
} 