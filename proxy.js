import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "./app/lib/session";

export default async function proxy(req) {
  const path = req.nextUrl.pathname;
  const isLoginRoute = path === "/admin/login";
  const isAdminRoute = path.startsWith("/admin") && !isLoginRoute;

  const cookie = (await cookies()).get("dspr_admin_session")?.value;
  const session = await decrypt(cookie);
  const isAdmin = Boolean(session?.userId);

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }
  if (isLoginRoute && isAdmin) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
