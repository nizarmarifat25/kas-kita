import NextAuth from 'next-auth';
import { authConfig } from './auth.config'; 

export default NextAuth(authConfig).auth;

export const config = {
  // Melindungi semua route kecuali api, _next/static, _next/image, dan favicon
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};