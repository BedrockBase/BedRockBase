import type { NextApiRequest, NextApiResponse } from 'next';

// Logs authentication attempts for audit purposes
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, success, error, timestamp } = req.body;
  // eslint-disable-next-line no-console
  console.log(
    `[AUTH ATTEMPT] Email: ${email}, Success: ${success}, Error: ${error || 'none'}, Time: ${timestamp}`
  );
  res.status(200).json({ message: 'Auth attempt logged' });
}
