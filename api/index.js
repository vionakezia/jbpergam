import { default as handler } from '../dist/server/server.js';

export default async function (req, res) {
  // Ambil protocol dan host untuk membangun URL lengkap
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['host'];
  const fullUrl = `${protocol}://${host}${req.url}`;

  // Buat objek Request standar web dari req Node.js
  const webReq = new Request(fullUrl, {
    method: req.method,
    headers: req.headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
    // Vercel node runtime handles body streaming
    duplex: 'half' 
  });

  const response = await handler.fetch(webReq);
  
  // Kirim balik response ke Vercel
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const body = await response.text();
  res.end(body);
}
