import { default as handler } from '../dist/server/server.js';

export default async function (req, res) {
  // Bridge antara Vercel Request dan TanStack Start Server
  return handler.fetch(req, res);
}
