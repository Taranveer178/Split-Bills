export const GROUP_CURRENCIES = [
  { code: 'INR', label: 'Indian Rupee (INR)' },
  { code: 'USD', label: 'US Dollar (USD)' },
  { code: 'EUR', label: 'Euro (EUR)' },
  { code: 'GBP', label: 'British Pound (GBP)' },
  { code: 'CAD', label: 'Canadian Dollar (CAD)' },
  { code: 'AUD', label: 'Australian Dollar (AUD)' },
];

export const formatCurrency = (amount, currency = 'INR', fractionDigits = 2) => {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: GROUP_CURRENCIES.some((item) => item.code === currency) ? currency : 'INR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
};

export const getCurrencySymbol = (currency = 'INR') => (
  new Intl.NumberFormat('en', {
    style: 'currency',
    currency: GROUP_CURRENCIES.some((item) => item.code === currency) ? currency : 'INR',
    maximumFractionDigits: 0,
  }).formatToParts(0).find((part) => part.type === 'currency')?.value || '₹'
);
