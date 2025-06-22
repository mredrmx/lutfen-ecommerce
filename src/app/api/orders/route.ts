import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "ekinler_bas_vermeden_kor_buzagı_topallamazmıs";

async function getUserIdFromSession(): Promise<number | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        return decoded.id;
    } catch (error) {
        return null;
    }
}

export async function GET(req: NextRequest) {
    const userId = await getUserIdFromSession();
    if (!userId) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    const orders = await prisma.order.findMany({
        where: { userId },
        include: { 
            items: true,
            address: true
        },
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: "Yetkisiz işlem" }, { status: 401 });
  }

  const body = await req.json();
  const { items, addressId } = body;

  if (!items || items.length === 0) {
    return NextResponse.json(
      { error: "Sepet boş olamaz" },
      { status: 400 }
    );
  }

  if (!addressId) {
    return NextResponse.json(
      { error: "Adres seçimi zorunludur" },
      { status: 400 }
    );
  }

  try {
    const address = await prisma.address.findUnique({
      where: { id: addressId, userId: userId },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Geçersiz adres" },
        { status: 404 }
      );
    }

    const order = await prisma.order.create({
      data: {
        userId: userId,
        addressId: addressId,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          })),
        },
      },
      include: {
        items: true,
      },
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Sipariş oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Sipariş oluşturulamadı" },
      { status: 500 }
    );
  }
} 