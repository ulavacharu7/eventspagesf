import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const cleanEmail = email ? email.trim().toLowerCase() : '';

    if (!name || !cleanEmail || !password) {
      return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
    }

    if (!cleanEmail.endsWith('@gmail.com')) {
      return NextResponse.json(
        {
          error:
            'Only @gmail.com email addresses are allowed for registration. For assistance or alternative domain approval, please contact support: +91 6304218064, +91 6309917327 or events.studentforge@gmail.com',
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name: name.trim(), email: cleanEmail, password: hashed },
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, profileImage: user.profileImage },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
  }
}
