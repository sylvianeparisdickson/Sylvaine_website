import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "@/lib/auth";

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // Protect admin routes (except login page)
  if (pathname.match(/^\/(en|fr|es)?\/admin(?!\/login)/)) {
    if (!req.auth) {
      const locale = pathname.split('/')[1] || 'en';
      const url = new URL(`/${locale}/admin/login`, req.url);
      return Response.redirect(url);
    }
  }
  
  return intlMiddleware(req);
});

export const config = {
  // Match only internationalized pathnames and normal routes, bypassing api, assets, etc.
  matcher: ["/", "/(en|fr|es)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
