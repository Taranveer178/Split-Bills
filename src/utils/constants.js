export const CATEGORIES = [
  'Food', 'Grocery', 'Petrol', 'Rent', 'Electricity', 'WiFi', 'Shopping', 'Entertainment', 'Other',
];

export const PAYMENT_METHODS = ['UPI', 'Cash', 'Other'];

export const generateInviteCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

export const INITIAL_EXPENSES = [];