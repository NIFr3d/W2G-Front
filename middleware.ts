import { NextRequest, NextResponse } from "next/server";

const authentifiedRoutes = ["/", "/profile"];

export default function middleware(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  const token = req.cookies.get("token")?.value;

  if (req.nextUrl.pathname.includes("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }
  if (
    authentifiedRoutes.some((route) => req.nextUrl.pathname.endsWith(route)) &&
    role !== "ADMIN" &&
    role !== "USER"
  ) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }
  if (req.nextUrl.pathname === "/admin" && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin/serie", req.nextUrl.origin));
  }
  const response = NextResponse.next();
  response.headers.set("Authorization", `Bearer ${token}`);
  return response;
}
