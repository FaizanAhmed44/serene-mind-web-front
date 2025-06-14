
import { Book, Clock, User, TrendingUp } from "lucide-react";

export interface Stat {
  label: string;
  value: string;
  icon: any;
}

export const dashboardStatsData: Stat[] = [
  { label: "Courses Completed", value: "3", icon: Book },
  { label: "Study Hours", value: "47", icon: Clock },
  { label: "Sessions Attended", value: "12", icon: User },
  { label: "Progress This Week", value: "+15%", icon: TrendingUp }
];
