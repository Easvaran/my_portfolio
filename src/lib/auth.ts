import connectDB from './mongodb';
import Admin from '@/models/Admin';

export const verifyAdminPassword = async (password: string | null) => {
  if (!password) return false;

  // 1. Check environment variable (default/fallback)
  const envPassword = process.env.ADMIN_PASSWORD;
  if (password === envPassword) return true;

  // 2. Check database (for updated passwords)
  try {
    await connectDB();
    const admin = await Admin.findOne({ password });
    if (admin) return true;
  } catch (error) {
    console.error('Auth verification database error:', error);
  }

  return false;
};
