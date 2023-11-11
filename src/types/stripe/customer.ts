interface Customer {
  id: string;
  object: string;
  address: null | Record<string, string>; // Assuming Address is another interface or type
  balance: number;
  created: number; // Unix timestamp
  currency: string;
  default_source: null | string; // Assuming it's a string or null
  delinquent: boolean;
  description: string;
  discount: null; // Update this if you have a specific type for discount
  email: null | string;
  invoice_prefix: string;
  invoice_settings: InvoiceSettings;
  livemode: boolean;
  metadata: Record<string, string>; // Or a more specific type if you know the structure of metadata
  name: null | string;
  next_invoice_sequence: number;
  phone: null | string;
  preferred_locales: string[];
  shipping: null | Record<string, string>; // Assuming Shipping is another interface or type
  tax_exempt: string; // Could be a specific set of strings, like 'none', 'exempt', etc.
  test_clock: null; // Update this if you have a specific type for test_clock
}

// Assuming InvoiceSettings is structured as follows:
interface InvoiceSettings {
  custom_fields: null; // Update this if you have a specific type for custom_fields
  default_payment_method: string;
  footer: null; // Update this if you have a specific type for footer
  rendering_options: null; // Update this if you have a specific type for rendering_options
}

// Add interfaces for Address and Shipping if they have specific structures

export default Customer;
