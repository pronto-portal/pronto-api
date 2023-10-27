export interface Product {
  id: string;
  object: string;
  active: boolean;
  created: number;
  default_price: string;
  description: string;
  features: Feature[];
  images: string[];
  livemode: boolean;
  metadata: {
    [key: string]: string;
  };
  name: string;
  package_dimensions: PackageDimensions | null;
  shippable: boolean | null;
  statement_descriptor: string | null;
  tax_code: string;
  unit_label: string | null;
  updated: number;
  url: string | null;
}

interface Feature {
  name: string;
}

interface PackageDimensions {
  width: number;
  height: number;
  length: number;
  weight: number;
}
