interface AddressArgs {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
}

export const addressToString = ({
  address1,
  address2,
  city,
  state,
  zipCode,
}: AddressArgs) => `${address1} ${address2} ${city}, ${state} ${zipCode}`;
