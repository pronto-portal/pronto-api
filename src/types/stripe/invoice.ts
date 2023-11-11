import { Price } from "./price";

interface Invoice {
  id: string;
  object: string;
  account_country: string;
  account_name: string;
  account_tax_ids: null;
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  amount_shipping: number;
  application: null;
  application_fee_amount: null;
  attempt_count: number;
  attempted: boolean;
  auto_advance: boolean;
  automatic_tax: {
    enabled: boolean;
    status: null;
  };
  billing_reason: string;
  charge: null;
  collection_method: string;
  created: number;
  currency: string;
  custom_fields: null;
  customer: string;
  customer_address: null;
  customer_email: null;
  customer_name: null;
  customer_phone: null;
  customer_shipping: null;
  customer_tax_exempt: string;
  customer_tax_ids: any[];
  default_payment_method: null;
  default_source: null;
  default_tax_rates: any[];
  description: null;
  discount: null;
  discounts: any[];
  due_date: null;
  effective_at: null;
  ending_balance: null;
  footer: null;
  from_invoice: null;
  hosted_invoice_url: null;
  invoice_pdf: null;
  last_finalization_error: null;
  latest_revision: null;
  lines: {
    object: string;
    data: LineItem[];
    has_more: boolean;
    url: string;
  };
  livemode: boolean;
  metadata: Record<string, unknown>;
  next_payment_attempt: null;
  number: null;
  on_behalf_of: null;
  paid: boolean;
  paid_out_of_band: boolean;
  payment_intent: null;
  payment_settings: {
    default_mandate: null;
    payment_method_options: null;
    payment_method_types: null;
  };
  period_end: number;
  period_start: number;
  post_payment_credit_notes_amount: number;
  pre_payment_credit_notes_amount: number;
  quote: null;
  receipt_number: null;
  rendering: null;
  shipping_cost: null;
  shipping_details: null;
  starting_balance: number;
  statement_descriptor: null;
  status: string;
  status_transitions: {
    finalized_at: null;
    marked_uncollectible_at: null;
    paid_at: null;
    voided_at: null;
  };
  subscription: string | null;
  subscription_details: {
    metadata: null;
  };
  subtotal: number;
  subtotal_excluding_tax: number;
  tax: null;
  test_clock: null;
  total: number;
  total_discount_amounts: any[];
  total_excluding_tax: number;
  total_tax_amounts: any[];
  transfer_data: null;
  webhooks_delivered_at: null;
}

interface LineItem {
  id: string;
  object: string;
  amount: number;
  amount_excluding_tax: number;
  currency: string;
  description: string;
  discount_amounts: any[];
  discountable: boolean;
  discounts: any[];
  invoice_item: string;
  livemode: boolean;
  metadata: Record<string, unknown>;
  period: {
    end: number;
    start: number;
  };
  price: Price;
  proration: boolean;
  proration_details: {
    credited_items: null;
  };
  quantity: number;
  subscription: null;
  tax_amounts: any[];
  tax_rates: any[];
  type: string;
  unit_amount_excluding_tax: string;
}

export default Invoice;
