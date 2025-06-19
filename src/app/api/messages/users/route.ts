import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
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

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const users = await prisma.user.findMany({
    where: { id: { not: userId } },
    select: { id: true, name: true, surname: true, email: true },
  });
  return NextResponse.json({ users });
} 