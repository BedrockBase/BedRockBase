import type { NextApiRequest, NextApiResponse } from 'next';

// This API route logs a message to the server terminal when called
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Log to the server terminal
  // eslint-disable-next-line no-console
  console.log('Sign In button clicked at', new Date().toISOString());
  res.status(200).json({ message: 'Logged sign in click to terminal' });
}
