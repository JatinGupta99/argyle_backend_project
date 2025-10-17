import { NextResponse } from 'next/server';

export async function POST() {
  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing DAILY_API_KEY. Add it in Vars and retry.' },
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }

  try {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
    const res = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        properties: {
          exp,
          enable_new_call_ui: true,
        },
        privacy: 'public',
      }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[v0] Daily create room failed:', text);
      return NextResponse.json(
        { error: 'Failed to create room', details: text },
        { status: 500, headers: { 'content-type': 'application/json' } }
      );
    }

    const data = await res.json();
    return NextResponse.json(
      { url: data.url },
      { headers: { 'content-type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[v0] Daily create room error:', err?.message);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
