
import { Book, Clock, User, TrendingUp } from "lucide-react";
import statsData from "./stats.json";
import type { Stat } from "./types/stats";

const iconMap = {
  Book,
  Clock,
  User,
  TrendingUp
};

export const dashboardStatsData: Stat[] = statsData.dashboardStats.map(stat => ({
  ...stat,
  icon: iconMap[stat.icon as keyof typeof iconMap]
}));
