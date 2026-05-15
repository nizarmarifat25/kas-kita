import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await db.insert(users).values({
      name: 'Nizar Admin',
      email: 'admin@kaskita.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    return NextResponse.json({ message: 'Akun admin berhasil dibuat! Silakan hapus file route ini.' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal atau email udah ada.' }, { status: 500 });
  }
}