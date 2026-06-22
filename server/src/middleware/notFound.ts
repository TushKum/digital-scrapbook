import type { RequestHandler } from 'express';

// Catch-all for unmatched routes (Express 5 safe — no path pattern).
export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({ error: 'not_found', message: `No route for ${req.method} ${req.originalUrl}` });
};
