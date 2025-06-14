
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  description: string;
  features: string[];
}

export const getPricingPlans = (coursePrice: number, courseOriginalPrice?: number): PricingPlan[] => [
  {
    id: "full",
    name: "Full Course Access",
    price: coursePrice,
    originalPrice: courseOriginalPrice,
    description: "Complete course with lifetime access",
    features: [
      "All course materials",
      "Lifetime access",
      "Certificate of completion",
      "Expert support",
      "Mobile & desktop access"
    ]
  },
  {
    id: "subscription",
    name: "Monthly Subscription",
    price: 39,
    originalPrice: null,
    description: "Access to this course and 100+ others",
    features: [
      "Access to 100+ courses",
      "New courses added monthly",
      "Cancel anytime",
      "Expert support",
      "Mobile & desktop access"
    ]
  }
];
