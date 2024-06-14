import URL from '../Models/URL.js';
import { startOfDay, startOfMonth } from 'date-fns';
import dotenv from 'dotenv';
dotenv.config()
export const getDashboardData = async (req, res) => {
  try {
    // Get total URLs created today
    const today = startOfDay(new Date());
    const urlsToday = await URL.countDocuments({ createdAt: { $gte: today } });

    // Get total URLs created this month
    const thisMonth = startOfMonth(new Date());
    const urlsThisMonth = await URL.countDocuments({ createdAt: { $gte: thisMonth } });

    // Get top 10 URLs with most clicks
    const topUrls = await URL.find().sort({ clickCount: -1 }).limit(10);

    res.status(200).json({
      urlsToday,
      urlsThisMonth,
      topUrls,
    });
  } catch (err) {
    res.status(500).json({message:'Server error.'});
  }
};
