import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { token, action } = await req.json();
    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret) {
      console.error('RECAPTCHA_SECRET is not set');
      return NextResponse.json({ success: false, message: 'recaptcha secret not configured' }, { status: 500 });
    }

    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);

    const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: params
    });
    const data = await resp.json();

    if (!data.success) {
      console.error('recaptcha verification failed', data);
      return NextResponse.json({ success: false, details: data }, { status: 400 });
    }

    const scoreOk = typeof data.score === 'number' ? data.score >= 0.3 : true;
    const actionOk = action ? data.action === action : true;

    if (data.success && scoreOk && actionOk) {
      return NextResponse.json({ success: true, score: data.score });
    }

    console.warn('recaptcha verification did not meet thresholds', data);
    return NextResponse.json({ success: false, details: data }, { status: 400 });
  } catch (err) {
    console.error('recaptcha route error', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}