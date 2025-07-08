import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.DEEPL_API_KEY;
    const deeplUrl = 'https://api-free.deepl.com/v2/languages?type=target';
    const response = await fetch(deeplUrl, {
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
      },
    });
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch languages' }, { status: 500 });
    }
    const data = await response.json();
    // Defensive: ensure data is always an array
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'DeepL API did not return an array', data }, { status: 500 });
    }
    return NextResponse.json({ languages: data });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unexpected error' }, { status: 500 });
  }
}