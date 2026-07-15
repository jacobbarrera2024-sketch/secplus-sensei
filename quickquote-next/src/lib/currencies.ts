export interface CurrencyOption {
  code: string;
  label: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "USD", label: "USD · US Dollar" },
  { code: "EUR", label: "EUR · Euro" },
  { code: "GBP", label: "GBP · British Pound" },
  { code: "CAD", label: "CAD · Canadian Dollar" },
  { code: "AUD", label: "AUD · Australian Dollar" },
  { code: "JPY", label: "JPY · Japanese Yen" },
  { code: "MXN", label: "MXN · Mexican Peso" },
  { code: "INR", label: "INR · Indian Rupee" },
];
