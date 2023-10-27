export interface Price {
  id: string;
  object: string;
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  custom_unit_amount: number | null;
  livemode: boolean;
  lookup_key: string | null;
  metadata: { [key: string]: string };
  nickname: string | null;
  product: string;
  recurring: Recurring;
  tax_behavior: string;
  tiers_mode: string | null;
  transform_quantity: any | null; // Adjust the type based on the structure of transform_quantity when available
  type: string;
  unit_amount: number;
  unit_amount_decimal: string;
}

interface Recurring {
  aggregate_usage: any | null; // Adjust the type based on the structure of aggregate_usage when available
  interval: string;
  interval_count: number;
  usage_type: string;
}
