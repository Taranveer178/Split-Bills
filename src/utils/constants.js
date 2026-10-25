export const CATEGORIES = [
  'Food', 'Grocery', 'Petrol', 'Rent', 'Electricity', 'WiFi', 'Shopping', 'Entertainment', 'Other',
];

export const PAYMENT_METHODS = ['UPI', 'Cash', 'Other'];

export const generateInviteCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

export const INITIAL_USERS = [
  { id: 'usr_taran', username: 'Taran', password: 'taran', createdAt: new Date().toISOString() },
  { id: 'usr_sushant', username: 'Sushant', password: 'sushant', createdAt: new Date().toISOString() },
  { id: 'usr_tushar', username: 'Tushar', password: 'tushar', createdAt: new Date().toISOString() },
];

export const INITIAL_GROUPS = [
  {
    id: 'grp_room302',
    name: 'Room',
    description: 'Flat 302 room expenses',
    inviteCode: 'SINGH1',
    createdBy: 'usr_taran',
    members: ['usr_taran', 'usr_sushant', 'usr_tushar'],
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_EXPENSES = [];