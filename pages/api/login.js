import { setCookie } from 'nookies';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { password } = req.body;
  const correctPassword = process.env.DASHBOARD_PASSWORD;

  if (password === correctPassword) {
    setCookie({ res }, 'auth', 'true', {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    return res.status(200).json({ message: 'Logged in' });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}