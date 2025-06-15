
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  description: string;
  features: string[];
}
