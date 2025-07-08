export async function fetchDeepLLanguages(apiKey) {
  const response = await fetch('https://api-free.deepl.com/v2/languages?type=target', {
    headers: {
      'Authorization': `DeepL-Auth-Key ${apiKey}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch DeepL languages');
  const data = await response.json();
  // Add flag emoji mapping for each language code
  const flagMap = {
    EN: '🇺🇸', DE: '🇩🇪', FR: '🇫🇷', ES: '🇪🇸', IT: '🇮🇹', NL: '🇳🇱', PL: '🇵🇱', PT: '🇵🇹', RU: '🇷🇺', JA: '🇯🇵', ZH: '🇨🇳', BG: '🇧🇬', CS: '🇨🇿', DA: '🇩🇰', EL: '🇬🇷', ET: '🇪🇪', FI: '🇫🇮', HU: '🇭🇺', LT: '🇱🇹', LV: '🇱🇻', RO: '🇷🇴', SK: '🇸🇰', SL: '🇸🇮', SV: '🇸🇪', TR: '🇹🇷', UK: '🇺🇦', NB: '🇳🇴', KO: '🇰🇷', ID: '🇮🇩', HI: '🇮🇳', AR: '🇸🇦', TH: '🇹🇭', VI: '🇻🇳', HE: '🇮🇱', MS: '🇲🇾'
  };
  return data.map(lang => ({
    code: lang.language,
    label: lang.name || lang.language,
    flag: flagMap[lang.language.toUpperCase()] || '🌐'
  }));
}
export const translateText = async (text, sourceLang, targetLang) => {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, sourceLang, targetLang })
  });
  if (!response.ok) throw new Error('Translation failed');
  const data = await response.json();
  return data.translatedText;
};
