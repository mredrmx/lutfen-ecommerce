import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "ekinler_bas_vermeden_kor_buzagı_topallamazmıs";

const adminRoutes = ["/admin", "/admin/products", "/admin/orders", "/admin/users"];
const adminApiRoutes = ["/api/admin", "/api/admin/products", "/api/admin/orders", "/api/admin/users"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApiRoute = pathname.startsWith("/api/");
  
  // Admin rotaları kontrolü
  if (adminRoutes.some(route => pathname.startsWith(route)) || 
      adminApiRoutes.some(route => pathname.startsWith(route))) {
    
    // Token'ı farklı kaynaklardan al
    let token = req.headers.get("authorization");
    if (token && token.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    } else {
      // Cookie'den token al
      const cookieToken = req.cookies.get("token")?.value;
      if (cookieToken) {
        token = cookieToken;
      }
    }
    
    // Token yoksa erişimi reddet
    if (!token) {
      if (isApiRoute) {
        return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
      }
      const url = new URL("/login", req.url);
      url.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(url);
    }
    
    // JWT doğrulaması yap
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      const userRole = (payload as any).role;
      
      // Admin rolü kontrolü
      if (!userRole || userRole.toLowerCase() !== "admin") {
        if (isApiRoute) {
          return NextResponse.json({ error: "Admin yetkisi gerekli." }, { status: 403 });
        }
        const url = new URL("/", req.url);
        return NextResponse.redirect(url);
      }
    } catch (error) {
      if (isApiRoute) {
        return NextResponse.json({ error: "Geçersiz token." }, { status: 401 });
      }
      const url = new URL("/login", req.url);
      url.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
}; 