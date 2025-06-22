import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// Token'dan kullanıcı ID'sini güvenli bir şekilde alan helper fonksiyonu
const getUserIdFromToken = (request: NextRequest): number | null => {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        return decoded.id;
    } catch (error) {
        return null;
    }
};

// Mevcut kullanıcının tüm adreslerini getir
export async function GET(request: NextRequest) {
    const userId = getUserIdFromToken(request);
    if (!userId) {
        return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    try {
        const addresses = await prisma.address.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(addresses);
    } catch (error) {
        return NextResponse.json({ error: "Adresler getirilirken bir hata oluştu." }, { status: 500 });
    }
}

// Yeni bir adres oluştur
export async function POST(request: NextRequest) {
    const userId = getUserIdFromToken(request);
    if (!userId) {
        return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, recipientName, recipientSurname, phone, city, district, neighborhood, fullAddress } = body;

        // Gerekli alanların kontrolü
        if (!title || !recipientName || !recipientSurname || !phone || !city || !district || !neighborhood || !fullAddress) {
            return NextResponse.json({ error: "Tüm alanların doldurulması zorunludur." }, { status: 400 });
        }

        const newAddress = await prisma.address.create({
            data: {
                userId,
                ...body,
            },
        });
        return NextResponse.json(newAddress, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Adres oluşturulurken bir hata oluştu." }, { status: 500 });
    }
} 