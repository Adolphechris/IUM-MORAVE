const GIST_ID = process.env.IUM_GIST_ID || '3b1d4ee92a98a838221520a908f742b9';
const GIST_TOKEN = process.env.IUM_GIST_TOKEN;

export async function fetchGistMessages(): Promise<any[]> {
  const token = GIST_TOKEN || process.env.IUM_GIST_TOKEN;
  if (!token || !GIST_ID) return [];

  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'IUM-MORAVE-Serverless'
      },
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    const content = data.files?.['ium_messages.json']?.content;
    return content ? JSON.parse(content) : [];
  } catch (err) {
    console.warn('[gist-db] Fetch error:', err);
    return [];
  }
}

export async function saveGistMessages(messages: any[]): Promise<boolean> {
  const token = GIST_TOKEN || process.env.IUM_GIST_TOKEN;
  if (!token || !GIST_ID) return false;

  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'IUM-MORAVE-Serverless'
      },
      body: JSON.stringify({
        files: {
          'ium_messages.json': {
            content: JSON.stringify(messages, null, 2)
          }
        }
      })
    });
    return res.ok;
  } catch (err) {
    console.warn('[gist-db] Save error:', err);
    return false;
  }
}
