import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  const { accept } = await req.json();
  const res = NextResponse.json({ ok: true });
  // Set a first-party httpOnly cookie to mark consent
  const maxAge = accept ? 60 * 60 * 24 * 365 : 60 * 60 * 24 * 365;
  res.cookies.set('consent', accept ? 'accepted' : 'rejected', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/'
  });
  return res;
}