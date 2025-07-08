import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { text, sourceLang, targetLang } = await req.json();
    const apiKey = process.env.DEEPL_API_KEY;
    const deeplUrl = 'https://api-free.deepl.com/v2/translate';
    const response = await fetch(deeplUrl, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        text,
        source_lang: sourceLang,
        target_lang: targetLang
      })
    });
    if (!response.ok) {
      return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
    }
    const data = await response.json();
    const translatedText = data.translations?.[0]?.text || '';
    return NextResponse.json({ translatedText });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}