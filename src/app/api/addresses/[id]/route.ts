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

// Bir adresi güncelle
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const userId = getUserIdFromToken(request);
    const addressId = Number(params.id);

    if (!userId) {
        return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }
    if (isNaN(addressId)) {
        return NextResponse.json({ error: "Geçersiz adres ID." }, { status: 400 });
    }

    try {
        const body = await request.json();
        // Adresin gerçekten bu kullanıcıya ait olduğundan emin ol
        const address = await prisma.address.findFirst({
            where: { id: addressId, userId: userId },
        });

        if (!address) {
            return NextResponse.json({ error: "Adres bulunamadı veya bu adresi güncelleme yetkiniz yok." }, { status: 404 });
        }

        const updatedAddress = await prisma.address.update({
            where: { id: addressId },
            data: body,
        });
        return NextResponse.json(updatedAddress);
    } catch (error) {
        return NextResponse.json({ error: "Adres güncellenirken bir hata oluştu." }, { status: 500 });
    }
}

// Bir adresi sil
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const userId = getUserIdFromToken(request);
    const addressId = Number(params.id);

    if (!userId) {
        return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }
    if (isNaN(addressId)) {
        return NextResponse.json({ error: "Geçersiz adres ID." }, { status: 400 });
    }

    try {
        // Adresin gerçekten bu kullanıcıya ait olduğundan emin ol
        const address = await prisma.address.findFirst({
            where: { id: addressId, userId: userId },
        });

        if (!address) {
            return NextResponse.json({ error: "Adres bulunamadı veya bu adresi silme yetkiniz yok." }, { status: 404 });
        }

        await prisma.address.delete({
            where: { id: addressId },
        });
        return NextResponse.json({ message: "Adres başarıyla silindi." }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Adres silinirken bir hata oluştu." }, { status: 500 });
    }
} 