export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Notion-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const endpoint = req.query.path || '';
  const notionUrl = `https://api.notion.com/v1/${String(endpoint).replace(/^\//, '')}`;

  const headers = {
    'Notion-Version': req.headers['notion-version'] || '2022-06-28',
    'Content-Type': 'application/json',
  };

  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization;
  }

  try {
    const notionRes = await fetch(notionUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' && req.body ? JSON.stringify(req.body) : undefined,
    });

    const data = await notionRes.json();
    res.status(notionRes.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to proxy request to Notion' });
  }
}
